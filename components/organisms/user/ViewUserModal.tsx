"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ShieldCheck, User as UserIcon } from "lucide-react";
import { type User } from "@/constants/users";
import { permissionsData } from "@/data/permissions";
import { getUserPermissions } from "@/utils/user-permission-storage";

interface ViewUserModalProps {
    user: User;
}

export function ViewUserModal({ user }: ViewUserModalProps) {
    const [userPermissions, setUserPermissions] = React.useState<number[]>([]);
    const [open, setOpen] = React.useState(false);

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
            if (!acc[curr.module]) {
                acc[curr.module] = [];
            }
            acc[curr.module].push(curr);
            return acc;
        }, {} as Record<string, typeof permissionsData>);
    }, []);

    function formatDate(date: Date | string | null | undefined): string {
        if (!date) return "—";
        const parsedDate = date instanceof Date ? date : new Date(date);
        if (isNaN(parsedDate.getTime())) return "Invalid date";

        return parsedDate.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-arcipta-blue-primary hover:text-arcipta-blue-primary/90"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        User Details
                    </DialogTitle>
                    <DialogDescription>
                        Summary of profile and access rights for {user.username}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    {/* --- LEFT COLUMN: Basic Info --- */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Username</span>
                            <p className="text-2xl font-bold text-arcipta-blue-primary tracking-tight">{user.username}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Role</span>
                                <div>
                                    <Badge
                                        variant={user.is_superadmin ? "default" : "secondary"}
                                        className={user.is_superadmin ? "bg-arcipta-blue-primary" : ""}
                                    >
                                        {user.is_superadmin ? "Superadmin" : "Admin"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                                <div>
                                    <Badge
                                        variant={user.is_active ? "default" : "secondary"}
                                        className={user.is_active ? "bg-green-600 text-white" : "bg-red-100 text-red-600"}
                                    >
                                        {user.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Created At</span>
                                <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Updated At</span>
                                <p className="text-sm font-medium">{formatDate(user.updated_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: Permissions --- */}
                    <div className="space-y-4 bg-muted/30 p-4 rounded-xl border">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                            <ShieldCheck className="h-4 w-4 text-arcipta-blue-primary" />
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Module Access</span>
                        </div>

                        {user.is_superadmin ? (
                            <div className="flex items-center justify-center py-10 text-center">
                                <div className="space-y-2">
                                    <Badge variant="outline" className="text-arcipta-blue-primary border-arcipta-blue-primary bg-arcipta-blue-primary/10 px-4 py-1 text-sm">
                                        Full Access Granted
                                    </Badge>
                                    <p className="text-xs text-muted-foreground max-w-[200px]">
                                        Superadmin users have override access to all platform modules.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                {Object.entries(groupedPermissions).map(([module, perms]) => (
                                    <div key={module} className="space-y-2">
                                        <p className="text-[9px] font-black uppercase text-arcipta-blue-primary/60 tracking-tighter">
                                            {module.replace(/_/g, " ")}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {perms.map((perm) => {
                                                const hasPerm = userPermissions.includes(perm.id);
                                                return (
                                                    <Badge
                                                        key={perm.id}
                                                        variant={hasPerm ? "default" : "outline"}
                                                        className={`text-[10px] py-0 px-2 font-medium capitalize ${hasPerm
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
