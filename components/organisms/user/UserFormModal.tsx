"use client";

import * as React from "react";
import Cookies from "js-cookie";
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
import { Loader2, Save, PlusCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { type User, type Permission } from "@/constants/users";
import { cn } from "@/lib/utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
    permissions: Permission[];
}

export function UserFormModal({
    open,
    onOpenChange,
    user,
    onSuccess,
    onError,
    permissions
}: Props) {
    const [form, setForm] = React.useState({
        username: "",
        password: "",
        confirmPassword: "",
        isSuper: false
    });
    const [selectedPerms, setSelectedPerms] = React.useState<number[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);
    const [showPass, setShowPass] = React.useState(false);
    const [showConfirmPass, setShowConfirmPass] = React.useState(false);

    const isEdit = !!user;

    const isMismatch = React.useMemo(() => {
        if (!form.confirmPassword) return false;
        return form.password !== form.confirmPassword;
    }, [form.password, form.confirmPassword]);

    React.useEffect(() => {
        if (open) {
            if (user) {
                setForm({
                    username: user.username,
                    password: "",
                    confirmPassword: "",
                    isSuper: user.is_superadmin === 1
                });

                const userPermStrings = Array.isArray(user.permissions) 
                    ? (user.permissions as unknown as string[]) 
                    : [];
                
                const matchedIds = permissions
                    .filter((p: Permission) => {
                        const permString = `${p.module}.${p.action}`;
                        return userPermStrings.includes(permString);
                    })
                    .map(p => Number(p.id));

                setSelectedPerms(matchedIds);
            } else {
                setForm({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    isSuper: false
                });
                setSelectedPerms([]);
            }
            setShowPass(false);
            setShowConfirmPass(false);
        }
    }, [open, user, permissions]);

    const handleSave = async () => {
        const uName = form.username.trim();
        if (!uName) return onError("Username is required");
        if (!isEdit && !form.password) return onError("Password is required");
        if (form.password !== form.confirmPassword) return onError("Passwords do not match");

        setIsSaving(true);
        const token = Cookies.get("token");

        const payload = {
            username: uName,
            is_superadmin: form.isSuper ? 1 : 0,
            is_active: isEdit ? (user?.is_active ?? 1) : 1,
            permission_ids: selectedPerms.map(id => Number(id)),
            password: form.password || null,
            password_confirmation: form.confirmPassword || null
        };

        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        const identifier = user?.uuid || user?.id;
        const url = isEdit ? `${baseUrl}/user/${identifier}` : `${baseUrl}/user`;

        try {
            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (!res.ok) {
                if (res.status === 422 && result.errors) {
                    const firstError = Object.values(result.errors)[0] as string[];
                    throw new Error(firstError[0]);
                }
                throw new Error(result.message || "Failed to save user");
            }

            onSuccess(isEdit ? "User updated successfully!" : "New user created successfully!");
            onOpenChange(false);
        } catch (err: any) {
            onError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const groupedPermissions = React.useMemo(() => {
        return permissions.reduce((acc, curr) => {
            if (!acc[curr.module]) acc[curr.module] = [];
            acc[curr.module].push(curr);
            return acc;
        }, {} as Record<string, Permission[]>);
    }, [permissions]);

    const focusStyles = "focus-visible:ring-1 focus-visible:ring-arcipta-blue-primary/40 focus-visible:border-arcipta-blue-primary/40 transition-all duration-300";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden border-none shadow-2xl font-satoshi bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase text-slate-900">
                        {isEdit ? "Update User Account" : "Register New User"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Set credentials and module-level access permissions.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-none">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                                Username
                            </Label>
                            <Input
                                value={form.username}
                                onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                                className={cn("rounded-xl h-11 bg-slate-50/50", focusStyles)}
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                                {isEdit ? "New Password" : "Password"}
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPass ? "text" : "password"}
                                    value={form.password}
                                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                                    className={cn("rounded-xl h-11 bg-slate-50/50 pr-10", focusStyles)}
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPass ? "text" : "password"}
                                    value={form.confirmPassword}
                                    onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={cn("rounded-xl h-11 bg-slate-50/50 pr-10", focusStyles, isMismatch && "border-red-500")}
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {isMismatch && (
                        <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase ml-1">
                            <AlertCircle className="size-3" /> Passwords do not match
                        </div>
                    )}

                    <div className="flex items-center space-x-4 border p-4 rounded-2xl bg-slate-50 border-slate-200/60">
                        <Switch
                            checked={form.isSuper}
                            onCheckedChange={v => setForm(prev => ({ ...prev, isSuper: v }))}
                            className="data-[state=checked]:bg-arcipta-blue-primary"
                        />
                        <div className="grid gap-1">
                            <Label className="font-bold text-slate-900">Superadmin Privilege</Label>
                            <p className="text-[11px] text-slate-500">Gives full override access to all system modules.</p>
                        </div>
                    </div>

                    {!form.isSuper && (
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                Module Permissions Access
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border rounded-2xl p-5 bg-slate-50/30 border-slate-200/50">
                                {Object.entries(groupedPermissions).map(([module, perms]) => (
                                    <div key={module} className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase text-arcipta-blue-primary/70 tracking-widest border-b border-arcipta-blue-primary/10 pb-1.5">{module}</h4>
                                        <div className="grid gap-3">
                                            {perms.map((perm) => (
                                                <div key={perm.id} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={`perm-${perm.id}`}
                                                        checked={selectedPerms.includes(Number(perm.id))}
                                                        onCheckedChange={(checked) => setSelectedPerms(prev => checked ? [...prev, Number(perm.id)] : prev.filter(id => id !== Number(perm.id)))}
                                                    />
                                                    <Label htmlFor={`perm-${perm.id}`} className="text-xs font-semibold capitalize cursor-pointer text-slate-600">{perm.action}</Label>
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
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 h-10 px-6 flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-slate-900 text-white rounded-xl h-10 px-8 font-bold text-[10px] uppercase tracking-widest min-w-[120px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                {isEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                {isEdit ? "Update User" : "Publish User"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}