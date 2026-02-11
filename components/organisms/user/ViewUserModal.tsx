"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, LayoutGrid } from "lucide-react";
import { type User } from "@/constants/users";
import { cn } from "@/lib/utils";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function ViewUserModal({ open, onOpenChange, user }: ViewProps) {
    if (!user) return null;

    const groupedPermissions = React.useMemo(() => {
        const rawPerms = Array.isArray(user.permissions) ? user.permissions : [];
        const groups: Record<string, string[]> = {};

        rawPerms.forEach((perm: any) => {
            if (typeof perm === "string" && perm.includes(".")) {
                const [moduleName, actionName] = perm.split(".");
                if (!groups[moduleName]) groups[moduleName] = [];
                groups[moduleName].push(actionName);
            } 
            else if (typeof perm === "object" && perm !== null && perm.module) {
                if (!groups[perm.module]) groups[perm.module] = [];
                groups[perm.module].push(perm.action);
            }
        });

        return groups;
    }, [user.permissions]);

    const formatFullDate = (date: any) => {
        if (!date) return "—";
        return new Date(date).toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "long",
            year: "numeric"
        }) + " WIB";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase text-slate-900">
                        User Account Details
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[80vh] w-full">
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "h-20 w-20 rounded-full border flex items-center justify-center shrink-0 text-2xl font-bold font-orbitron shadow-sm",
                                Number(user.is_superadmin) === 1 
                                    ? "bg-arcipta-blue-primary/10 border-arcipta-blue-primary/20 text-arcipta-blue-primary" 
                                    : "bg-slate-100 border-slate-200 text-slate-500"
                            )}>
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-slate-900">{user.username}</h2>
                                <div className="flex gap-2">
                                    <Badge className="bg-arcipta-blue-primary uppercase text-[9px] tracking-widest">
                                        {Number(user.is_superadmin) === 1 ? "Superadmin" : "Admin"}
                                    </Badge>
                                    <Badge variant="outline" className={cn(
                                        "uppercase text-[9px] tracking-widest", 
                                        Number(user.is_active) === 1 ? "text-emerald-600 border-emerald-200" : "text-red-600 border-red-200"
                                    )}>
                                        {Number(user.is_active) === 1 ? "Active Account" : "Inactive Account"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <ShieldCheck className="h-4 w-4 text-arcipta-blue-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Authorized Modules</span>
                                </div>
                                
                                {Number(user.is_superadmin) === 1 ? (
                                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                        <p className="text-xs text-emerald-700 font-medium">
                                            Full Override Access: User can access all system modules.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {Object.keys(groupedPermissions).length > 0 ? (
                                            Object.entries(groupedPermissions).map(([moduleName, actions]) => (
                                                <div key={moduleName} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <LayoutGrid className="size-3 text-slate-400" />
                                                        <p className="text-[10px] font-black uppercase text-slate-600 tracking-tight">{moduleName}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 pl-5">
                                                        {actions.map((actionName, idx) => (
                                                            <Badge key={`${moduleName}-${idx}`} variant="secondary" className="bg-white text-[9px] border-slate-200 text-slate-500 font-medium capitalize">
                                                                {actionName}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                                                <p className="text-xs text-slate-400 italic">No module permissions assigned.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Registered At</p>
                                        <p className="text-xs font-semibold text-slate-700">{formatFullDate(user.created_at)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Last Profile Update</p>
                                        <p className="text-xs font-semibold text-slate-700">{formatFullDate(user.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}