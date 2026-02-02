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
import { addUser } from "@/utils/user-storage";
import { addUserPermissions } from "@/utils/user-permission-storage";
import { type User } from "@/constants/users";
import { type UserPermission } from "@/constants/user_permissions";

export function CreateUserModal({ open, onOpenChange, onSuccess, onError }: any) {
    const [form, setForm] = React.useState({ username: "", password: "", isSuper: false });
    const [selectedPerms, setSelectedPerms] = React.useState<number[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setForm({ username: "", password: "", isSuper: false });
            setSelectedPerms([]);
        }
    }, [open]);

    const togglePermission = (id: number) => {
        setSelectedPerms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (!form.username.trim() || !form.password.trim()) {
            return onError("Username and password are required");
        }
        
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            const now = new Date();
            const userId = Date.now();

            const newUser: User = {
                id: userId,
                username: form.username,
                password_hash: form.password,
                is_superadmin: form.isSuper,
                is_active: true,
                created_at: now,
                updated_at: now,
                deleted_at: null, 
            };

            const newPermissions: UserPermission[] = selectedPerms.map((permId) => ({
                id: Date.now() + Math.random(), 
                user_id: userId,
                permission_id: permId,
                is_allowed: true,
                created_at: now,
                updated_at: now,
            }));

            addUser(newUser);
            addUserPermissions(newPermissions);

            onOpenChange(false);
            onSuccess();
        } catch (err) {
            onError("Failed to create user");
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
            <DialogContent className="max-w-[92vw] sm:max-w-[700px] max-h-[95vh] overflow-y-auto p-5 sm:p-8 rounded-2xl border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New User</DialogTitle>
                    <DialogDescription>Assign credentials and module access rights.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input 
                                id="username"
                                placeholder="Enter username"
                                value={form.username} 
                                onChange={e => setForm({...form, username: e.target.value})} 
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password"
                                type="password" 
                                placeholder="Enter password"
                                value={form.password} 
                                onChange={e => setForm({...form, password: e.target.value})} 
                                className="h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 border p-4 rounded-xl bg-muted/30">
                        <Switch 
                            id="superadmin"
                            checked={form.isSuper} 
                            onCheckedChange={v => setForm({...form, isSuper: v})} 
                            className="data-[state=checked]:bg-arcipta-blue-primary"
                        />
                        <div className="grid gap-1">
                            <Label htmlFor="superadmin" className="font-bold">Superadmin Privilege</Label>
                            <p className="text-xs text-muted-foreground">Full access override to all system modules.</p>
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
                                                        id={`perm-${perm.id}`}
                                                        checked={selectedPerms.includes(perm.id)}
                                                        onCheckedChange={() => togglePermission(perm.id)}
                                                        className="rounded-md border-slate-300 data-[state=checked]:bg-arcipta-blue-primary data-[state=checked]:border-arcipta-blue-primary"
                                                    />
                                                    <Label
                                                        htmlFor={`perm-${perm.id}`}
                                                        className="text-sm font-medium capitalize cursor-pointer hover:text-arcipta-blue-primary transition-colors"
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

                <DialogFooter className="flex-row gap-3 mt-4">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl font-semibold" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="flex-1 h-12 bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 text-white font-semibold rounded-xl transition-all" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving</> : "Create User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}