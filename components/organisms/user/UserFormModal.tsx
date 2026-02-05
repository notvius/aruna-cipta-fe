"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, UserPlus, ShieldAlert } from "lucide-react";
import { permissionsData } from "@/data/permissions";
import { addUser, updateUser } from "@/utils/user-storage";
import { addUserPermissions, updateUserPermissions, getUserPermissions } from "@/utils/user-permission-storage";
import { type User } from "@/constants/users";
import { type UserPermission } from "@/constants/user_permissions";
import { cn } from "@/lib/utils";

interface UserFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null; 
    onSave?: (u: User) => void;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export function UserFormModal({ 
    open, 
    onOpenChange, 
    user, 
    onSave, 
    onSuccess, 
    onError 
}: UserFormModalProps) {
    const [form, setForm] = React.useState({ username: "", password: "", isSuper: false });
    const [selectedPerms, setSelectedPerms] = React.useState<number[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);

    const isEdit = !!user;

    React.useEffect(() => {
        if (open) {
            if (user) {
                setForm({ username: user.username, password: "", isSuper: user.is_superadmin });
                const allPerms = getUserPermissions();
                const userPerms = allPerms
                    .filter(p => p.user_id === user.id && p.is_allowed)
                    .map(p => p.permission_id);
                setSelectedPerms(userPerms);
            } else {
                setForm({ username: "", password: "", isSuper: false });
                setSelectedPerms([]);
            }
        }
    }, [open, user]);

    const togglePermission = (id: number) => {
        setSelectedPerms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const handleSave = async () => {
        if (!form.username.trim()) return onError("Username is required");
        if (!isEdit && !form.password.trim()) return onError("Password is required");

        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            const now = new Date();
            const targetId = isEdit && user ? user.id : Date.now();

            const userData: User = {
                id: targetId,
                username: form.username,
                password_hash: form.password || (user?.password_hash ?? ""),
                is_superadmin: form.isSuper,
                is_active: isEdit && user ? user.is_active : true,
                created_at: isEdit && user ? user.created_at : now,
                updated_at: now,
                deleted_at: isEdit && user ? user.deleted_at : null,
            };

            const newPermissions: UserPermission[] = selectedPerms.map(permId => ({
                id: Date.now() + Math.random(),
                user_id: targetId,
                permission_id: permId,
                is_allowed: true,
                created_at: now,
                updated_at: now
            }));

            if (isEdit && onSave) {
                updateUser(userData);
                updateUserPermissions(targetId, newPermissions);
                onSave(userData);
                onSuccess("User account updated successfully!");
            } else {
                addUser(userData);
                addUserPermissions(newPermissions);
                onSuccess("New user created successfully!");
            }
            onOpenChange(false);
        } catch (err) {
            onError("Failed to process user data.");
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

    const inputFocus = "focus-visible:ring-2 focus-visible:ring-arcipta-blue-primary/20 focus-visible:border-arcipta-blue-primary transition-all duration-300";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl font-satoshi" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        {isEdit ? "Update User Account" : "Register New User"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground tracking-tight">
                        {isEdit ? `Modifying permissions ${user?.username}` : "Create a new administrative identity"}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Username</Label>
                            <Input 
                                value={form.username} 
                                onChange={e => setForm({...form, username: e.target.value})} 
                                className={cn("rounded-xl h-11 bg-slate-50/50", inputFocus)}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">
                                {isEdit ? "New Password" : "Account Password"}
                            </Label>
                            <Input 
                                type="password" 
                                placeholder={isEdit ? "Type a new password" : "••••••••"}
                                value={form.password} 
                                onChange={e => setForm({...form, password: e.target.value})} 
                                className={cn("rounded-xl h-11 bg-slate-50/50", inputFocus)}
                                disabled={isSaving}
                            />
                        </div>
                    </div>

=                    <div className="flex items-center space-x-4 border p-4 rounded-2xl bg-slate-50 border-slate-200/60">
                        <Switch 
                            checked={form.isSuper} 
                            onCheckedChange={v => setForm({...form, isSuper: v})} 
                            className="data-[state=checked]:bg-arcipta-blue-primary"
                            disabled={isSaving}
                        />
                        <div className="grid gap-1">
                            <Label className="font-bold text-slate-900 flex items-center gap-2">
                                Superadmin Privilege 
                            </Label>
                            <p className="text-[11px] text-slate-500 leading-tight">Gives full override access to all system modules and data.</p>
                        </div>
                    </div>

                    {!form.isSuper && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Module Permissions Access</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border rounded-2xl p-5 bg-slate-50/30 border-slate-200/50">
                                {Object.entries(groupedPermissions).map(([module, perms]) => (
                                    <div key={module} className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase text-arcipta-blue-primary/70 tracking-widest border-b border-arcipta-blue-primary/10 pb-1.5">
                                            {module.replace(/_/g, " ")}
                                        </h4>
                                        <div className="grid gap-3">
                                            {perms.map((perm) => (
                                                <div key={perm.id} className="flex items-center space-x-3 group">
                                                    <Checkbox
                                                        id={`perm-${perm.id}`}
                                                        checked={selectedPerms.includes(perm.id)}
                                                        onCheckedChange={() => togglePermission(perm.id)}
                                                        className="data-[state=checked]:bg-arcipta-blue-primary data-[state=checked]:border-arcipta-blue-primary"
                                                        disabled={isSaving}
                                                    />
                                                    <Label 
                                                        htmlFor={`perm-${perm.id}`} 
                                                        className="text-xs font-semibold capitalize cursor-pointer text-slate-600 group-hover:text-arcipta-blue-primary transition-colors"
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

                <DialogFooter className="p-6 pt-0 flex gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isSaving}
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-100 h-11 px-6"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-arcipta-blue-primary hover:opacity-90 text-white rounded-xl h-11 px-8 shadow-sm font-bold text-[10px] uppercase tracking-widest min-w-[150px]"
                    >
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> processing...</>
                        ) : (
                            <>{isEdit ? <Save className="mr-2 h-3 w-3" /> : <UserPlus className="mr-2 h-3 w-3" />} {isEdit ? "Update User" : "Register User"}</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}