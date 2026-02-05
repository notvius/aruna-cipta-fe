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
import { ShieldCheck, Calendar, UserCircle, Circle } from "lucide-react";
import { type User } from "@/constants/users";
import { permissionsData } from "@/data/permissions";
import { getUserPermissions } from "@/utils/user-permission-storage";
import { cn } from "@/lib/utils";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
}

export function ViewUserModal({ open, onOpenChange, user }: ViewProps) {
    const [userPermissions, setUserPermissions] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (open && user) {
            const allPerms = getUserPermissions();
            const filtered = allPerms
                .filter((p) => p.user_id === user.id && p.is_allowed)
                .map((p) => p.permission_id);
            setUserPermissions(filtered);
        }
    }, [open, user]);

    const groupedPermissions = React.useMemo(() => {
        return permissionsData.reduce((acc, curr) => {
            if (!acc[curr.module]) acc[curr.module] = [];
            acc[curr.module].push(curr);
            return acc;
        }, {} as Record<string, typeof permissionsData>);
    }, []);

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

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        User Account Details
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[85vh] w-full">
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-16 w-16 rounded-full border flex items-center justify-center shrink-0 shadow-sm",
                                    user.is_superadmin 
                                        ? "bg-arcipta-blue-primary/10 border-arcipta-blue-primary/20 text-arcipta-blue-primary" 
                                        : "bg-slate-100 border-slate-200 text-slate-500"
                                )}>
                                    <span className="font-bold text-xl font-orbitron">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="space-y-0.5 overflow-hidden">
                                    <p className="text-[10px] font-black  uppercase text-muted-foreground tracking-widest leading-none">Username</p>
                                    <p className="text-xl font-bold text-arcipta-blue-primary truncate">{user.username}</p>
                                </div>
                            </div>
                            
                            <div className="flex md:justify-end items-center gap-3">
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Role</p>
                                    <Badge 
                                        variant={user.is_superadmin ? "default" : "outline"} 
                                        className={cn(
                                            "font-bold uppercase tracking-widest text-[9px] px-3 py-1 bg-arcipta-blue-primary text-white",
                                        )}
                                    >
                                        {user.is_superadmin ? "Superadmin" : "Admin"}
                                    </Badge>
                                </div>
                                <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block" />
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Current Status</p>
                                    <Badge className={cn(
                                        "font-bold uppercase tracking-widest text-[9px] px-3 py-1 gap-1.5",
                                        user.is_active ? "bg-emerald-500 text-white" : "bg-red-100 text-red-600 shadow-none border-none"
                                    )}>
                                        <Circle className={cn("size-1.5 fill-current", user.is_active && "animate-pulse")} />
                                        {user.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                            <div className="md:col-span-7 space-y-4 bg-muted/30 p-5 rounded-2xl border border-dashed border-border/80">
                                <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-2">
                                    <ShieldCheck className="h-5 w-5 text-arcipta-blue-primary" />
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Module Access</span>
                                </div>

                                {user.is_superadmin ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                                        <Badge variant="outline" className="text-arcipta-blue-primary border-arcipta-blue-primary bg-arcipta-blue-primary/10 px-4 py-1 text-sm font-bold">
                                            FULL ACCESS GRANTED
                                        </Badge>
                                        <p className="text-[11px] text-muted-foreground max-w-[200px] leading-relaxed">
                                            Superadmin users have override access to all platform modules and data management.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-5 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                        {Object.entries(groupedPermissions).map(([module, perms]) => (
                                            <div key={module} className="space-y-2">
                                                <p className="text-[10px] font-black uppercase text-arcipta-blue-primary/60 tracking-tight">
                                                    {module.replace(/_/g, " ")}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {perms.map((perm) => {
                                                        const hasPerm = userPermissions.includes(perm.id);
                                                        return (
                                                            <Badge
                                                                key={perm.id}
                                                                variant={hasPerm ? "default" : "outline"}
                                                                className={cn(
                                                                    "text-[9px] py-0.5 px-2.5 capitalize font-bold tracking-tight",
                                                                    hasPerm ? "bg-arcipta-blue-primary/80" : "opacity-40 line-through decoration-muted-foreground"
                                                                )}
                                                            >
                                                                {perm.action}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-5 space-y-6">
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="size-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-tight">Created At</span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-700 pl-5">{formatFullDate(user.created_at)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <UserCircle className="size-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-tight">Last Update</span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-700 pl-5">{formatFullDate(user.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-1">
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Note: Superadmin accounts have unrestricted access to all modules and system configurations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}