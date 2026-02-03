"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { type User } from "@/constants/users";
import { permissionsData } from "@/data/permissions";
import { getUserPermissions } from "@/utils/user-permission-storage";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
}

export function ViewUserModal({ open, onOpenChange, user }: ViewProps) {
    const [userPermissions, setUserPermissions] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (open) {
            const allPerms = getUserPermissions();
            const filtered = allPerms
                .filter((p) => p.user_id === user.id && p.is_allowed)
                .map((p) => p.permission_id);
            setUserPermissions(filtered);
        }
    }, [open, user.id]);

    const groupedPermissions = React.useMemo(() => {
        return permissionsData.reduce((acc, curr) => {
            if (!acc[curr.module]) acc[curr.module] = [];
            acc[curr.module].push(curr);
            return acc;
        }, {} as Record<string, typeof permissionsData>);
    }, []);

    const format = (d: Date | string | null | undefined) => {
        if (!d) return "—";
        const date = d instanceof Date ? d : new Date(d);
        return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString("id-ID", {
            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
        });
    };

    const Field = ({ label, value, badge, full }: { label: string; value?: string; badge?: React.ReactNode; full?: boolean }) => (
        <div className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
            {badge ? (
                <div className="pt-0.5">{badge}</div>
            ) : (
                <p className={`${full ? "text-2xl font-bold text-arcipta-blue-primary tracking-tight" : "text-sm font-medium text-foreground"}`}>
                    {value || <span className="italic text-muted-foreground">No data</span>}
                </p>
            )}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[92vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">User Details</DialogTitle>
                    <DialogDescription className="text-sm">
                        Summary of profile and access rights for {user.username}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    <div className="space-y-6">
                        <Field label="Username" value={user.username} full />

                        <div className="grid grid-cols-2 gap-4">
                            <Field 
                                label="Role" 
                                badge={
                                    <Badge variant={user.is_superadmin ? "default" : "secondary"} className={user.is_superadmin ? "bg-arcipta-blue-primary" : ""}>
                                        {user.is_superadmin ? "Superadmin" : "Admin"}
                                    </Badge>
                                } 
                            />
                            <Field 
                                label="Status" 
                                badge={
                                    <Badge className={user.is_active ? "bg-green-600 text-white" : "bg-red-100 text-red-600"}>
                                        {user.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                } 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/60">
                            <Field label="Created At" value={format(user.created_at)} />
                            <Field label="Updated At" value={format(user.updated_at)} />
                        </div>
                    </div>

                    <div className="space-y-4 bg-muted/30 p-5 rounded-2xl border border-dashed border-border/80">
                        <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-2">
                            <ShieldCheck className="h-5 w-5 text-arcipta-blue-primary" />
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Module Access</span>
                        </div>

                        {user.is_superadmin ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                                <Badge variant="outline" className="text-arcipta-blue-primary border-arcipta-blue-primary bg-arcipta-blue-primary/10 px-4 py-1 text-sm">
                                    Full Access Granted
                                </Badge>
                                <p className="text-xs text-muted-foreground max-w-[200px]">
                                    Superadmin users have override access to all platform modules.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
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
                                                        className={`text-[10px] py-0.5 px-2.5 capitalize ${hasPerm 
                                                            ? "bg-arcipta-blue-primary/80" 
                                                            : "opacity-40 line-through decoration-muted-foreground"
                                                        }`}
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
                </div>
            </DialogContent>
        </Dialog>
    );
}