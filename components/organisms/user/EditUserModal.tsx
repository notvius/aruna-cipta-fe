"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Loader2, Pencil } from "lucide-react";
import { type User } from "@/constants/users";
import { type Permission } from "@/data/permissions";
import { permissionsData } from "@/data/permissions";
import { updateUser } from "@/utils/user-storage";
import { updateUserPermissions, getUserPermissions } from "@/utils/user-permission-storage";
import { type UserPermission } from "@/constants/user_permissions";
import AlertError2 from "@/components/alert-error-2";
import AlertSuccess2 from "@/components/alert-success-2";

interface EditUserModalProps {
    user: User;
    onSave?: (updatedUser: User) => void;
}

export function EditUserModal({
    user,
    onSave,
}: EditUserModalProps) {
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = React.useState(user.username);
    const [password, setPassword] = React.useState(user.password_hash);
    const [isSuperadmin, setIsSuperadmin] = React.useState(user.is_superadmin);
    const [selectedPermissions, setSelectedPermissions] = React.useState<number[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);

    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (open) {
            setError(null);

            const allUserPerms = getUserPermissions();
            const userPerms = allUserPerms
                .filter(p => p.user_id === user.id && p.is_allowed)
                .map(p => p.permission_id);
            setSelectedPermissions(userPerms);
            setUsername(user.username);
            setPassword(user.password_hash);
            setIsSuperadmin(user.is_superadmin);
        } else {
            setError(null);
            setSuccess(null);
        }
    }, [open, user]);

    React.useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [username, password, isSuperadmin, selectedPermissions]);

    const groupedPermissions = React.useMemo(() => {
        return permissionsData.reduce((acc, curr) => {
            if (!acc[curr.module]) {
                acc[curr.module] = [];
            }
            acc[curr.module].push(curr);
            return acc;
        }, {} as Record<string, Permission[]>);
    }, []);

    const togglePermission = (id: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (!username.trim()) return setError("Username is required");
        if (!password.trim()) return setError("Password is required");
        if (!isSuperadmin && selectedPermissions.length === 0) return setError("Please select at least one permission");

        setError(null);
        setIsSaving(true);

        try {
            const now = new Date();
            const updatedUser: User = {
                ...user,
                username,
                password_hash: password,
                is_superadmin: isSuperadmin,
                updated_at: now,
            };

            const updatedPermissions: UserPermission[] = selectedPermissions.map((permId) => ({
                id: Date.now() + Math.random(),
                user_id: user.id,
                permission_id: permId,
                is_allowed: true,
                created_at: now, 
                updated_at: now,
            }));

            updateUser(updatedUser);
            updateUserPermissions(user.id, updatedPermissions);

            await new Promise((resolve) => setTimeout(resolve, 800));

            setSuccess("User updated successfully!");
            setIsSaving(false);

            if (onSave) onSave(updatedUser);

            setTimeout(() => {
                setOpen(false);
            }, 1500);
        } catch (error) {
            setError("Failed to update user. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-arcipta-blue-primary shadow-none hover:bg-blue-50"
                onClick={() => setOpen(true)}
            >
                <Pencil className="h-4 w-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto font-sans">
                    <DialogHeader>
                        <DialogTitle>Edit User: {user.username}</DialogTitle>
                        <DialogDescription>
                            Update user details and assigned permissions.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                    <AlertError2 message={error} onClose={() => setError(null)} />
                    )}

                    {success && (
                        <AlertSuccess2 message={success} />
                    )}

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-username">Username</Label>
                                <Input
                                    id="edit-username"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-password">Password</Label>
                                <Input
                                    id="edit-password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-muted/50">
                            <Switch
                                id="edit-superadmin"
                                checked={isSuperadmin}
                                onCheckedChange={setIsSuperadmin}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label
                                    htmlFor="edit-superadmin"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Superadmin Privilege
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Superadmins have all permissions by default.
                                </p>
                            </div>
                        </div>

                        {!isSuperadmin && (
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Module Permissions</Label>
                                <div className="grid grid-cols-2 gap-6 border rounded-lg p-4">
                                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                                        <div key={module} className="space-y-3">
                                            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider border-b pb-1">
                                                {module.replace(/_/g, " ")}
                                            </h4>
                                            <div className="grid gap-2">
                                                {perms.map((perm) => (
                                                    <div key={perm.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`edit-perm-${perm.id}`}
                                                            checked={selectedPermissions.includes(perm.id)}
                                                            onCheckedChange={() => togglePermission(perm.id)}
                                                        />
                                                        <Label
                                                            htmlFor={`edit-perm-${perm.id}`}
                                                            className="text-sm font-normal capitalize cursor-pointer"
                                                        >
                                                            {perm.action}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 min-w-[100px]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Update User"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
