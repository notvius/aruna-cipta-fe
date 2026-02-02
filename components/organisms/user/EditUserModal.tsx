"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { permissionsData } from "@/data/permissions";
import { updateUser } from "@/utils/user-storage";
import { updateUserPermissions, getUserPermissions } from "@/utils/user-permission-storage";
import { type User } from "@/constants/users";
import { type UserPermission } from "@/constants/user_permissions";

interface EditProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    onSave: (u: User) => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
}

export function EditUserModal({ open, onOpenChange, user, onSave, onSuccess, onError }: EditProps) {
    const [form, setForm] = React.useState({ username: "", password: "", isSuper: false });
    const [selectedPerms, setSelectedPerms] = React.useState<number[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setForm({ 
                username: user.username, 
                password: "", 
                isSuper: user.is_superadmin 
            });
            
            const allPerms = getUserPermissions();
            const userPerms = allPerms
                .filter(p => p.user_id === user.id && p.is_allowed)
                .map(p => p.permission_id);
            setSelectedPerms(userPerms);
        }
    }, [open, user]);

    const togglePermission = (id: number) => {
        setSelectedPerms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const handleSave = async () => {
        if (!form.username.trim()) return onError("Username is required");
        if (!form.password.trim()) return onError("New password is required");
        
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            const now = new Date();

            const updatedUser: User = {
                ...user,
                username: form.username,
                password_hash: form.password, 
                is_superadmin: form.isSuper,
                updated_at: now,
                deleted_at: user.deleted_at || null
            };

            const newPermissions: UserPermission[] = selectedPerms.map(permId => ({
                id: Date.now() + Math.random(),
                user_id: user.id,
                permission_id: permId,
                is_allowed: true,
                created_at: now,
                updated_at: now
            }));

            updateUser(updatedUser);
            updateUserPermissions(user.id, newPermissions);
            
            onSave(updatedUser);
            onOpenChange(false);
            onSuccess();
        } catch {
            onError("Failed to update user.");
        } finally {
            setIsSaving(false);
        }
    };

    const groupedPermissions = React.useMemo(() => {
        return permissionsData.reduce((acc, curr) => {
            if (!acc[curr.module]) acc[curr.module] = [];
            acc[curr.module].push(curr);
            return acc;
        }, {} as Record<string, typeof permissionsData>);
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[92vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-5 sm:p-8 rounded-2xl border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit User: {user.username}</DialogTitle>
                    <DialogDescription>Update credentials and system access rights.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input 
                                value={form.username} 
                                onChange={e => setForm({...form, username: e.target.value})} 
                                className="h-11 rounded-xl" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input 
                                type="password" 
                                placeholder="Required to update"
                                value={form.password} 
                                onChange={e => setForm({...form, password: e.target.value})} 
                                className="h-11 rounded-xl" 
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 border p-4 rounded-xl bg-muted/30">
                        <Switch 
                            checked={form.isSuper} 
                            onCheckedChange={v => setForm({...form, isSuper: v})} 
                            className="data-[state=checked]:bg-arcipta-blue-primary"
                        />
                        <div className="grid gap-1">
                            <Label className="font-bold">Superadmin Privilege</Label>
                            <p className="text-xs text-muted-foreground">Full access override enabled if active.</p>
                        </div>
                    </div>

                    {!form.isSuper && (
                        <div className="space-y-4">
                            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Module Permissions</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border rounded-2xl p-5 bg-slate-50/50">
                                {Object.entries(groupedPermissions).map(([module, perms]) => (
                                    <div key={module} className="space-y-3">
                                        <h4 className="text-[11px] font-black uppercase text-arcipta-blue-primary/70 tracking-tighter border-b pb-1">
                                            {module.replace(/_/g, " ")}
                                        </h4>
                                        <div className="grid gap-2.5">
                                            {perms.map((perm) => (
                                                <div key={perm.id} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={`edit-perm-${perm.id}`}
                                                        checked={selectedPerms.includes(perm.id)}
                                                        onCheckedChange={() => togglePermission(perm.id)}
                                                        className="data-[state=checked]:bg-arcipta-blue-primary data-[state=checked]:border-arcipta-blue-primary"
                                                    />
                                                    <Label htmlFor={`edit-perm-${perm.id}`} className="text-sm font-medium capitalize cursor-pointer">
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

                <DialogFooter className="flex-row gap-3 mt-4">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl font-semibold" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="flex-1 h-12 bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 text-white font-semibold rounded-xl" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving</> : "Update User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}