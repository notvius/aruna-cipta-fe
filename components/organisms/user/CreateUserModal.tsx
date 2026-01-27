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
import { Loader2 } from "lucide-react";
import { type User } from "@/constants/users";
import { type Permission } from "@/data/permissions";
import { permissionsData } from "@/data/permissions";
import { addUser } from "@/utils/user-storage";
import { addUserPermissions } from "@/utils/user-permission-storage";
import { type UserPermission } from "@/constants/user_permissions";

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateUserModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateUserModalProps) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isSuperadmin, setIsSuperadmin] = React.useState(false);
    const [selectedPermissions, setSelectedPermissions] = React.useState<number[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);

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
        if (!username.trim()) return alert("Username is required");
        if (!password.trim()) return alert("Password is required");

        setIsSaving(true);

        const now = new Date();
        const userId = Date.now();

        const newUser: User = {
            id: userId,
            username,
            password_hash: password,
            is_active: true,
            is_superadmin: isSuperadmin,
            created_at: now,
            updated_at: now,
            deleted_at: null,
        };

        const newPermissions: UserPermission[] = selectedPermissions.map((permId) => ({
            id: Date.now() + Math.random(),
            user_id: userId,
            permission_id: permId,
            is_allowed: true,
            created_at: now,
            updated_at: now,
        }));

        addUser(newUser);
        addUserPermissions(newPermissions);

        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsSaving(false);
        setUsername("");
        setPassword("");
        setIsSuperadmin(false);
        setSelectedPermissions([]);
        onOpenChange(false);
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user and assign specific permissions.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-lg bg-muted/50">
                        <Switch
                            id="superadmin"
                            checked={isSuperadmin}
                            onCheckedChange={setIsSuperadmin}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="superadmin"
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
                                                        id={`perm-${perm.id}`}
                                                        checked={selectedPermissions.includes(perm.id)}
                                                        onCheckedChange={() => togglePermission(perm.id)}
                                                    />
                                                    <Label
                                                        htmlFor={`perm-${perm.id}`}
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
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
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
                            "Create User"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
