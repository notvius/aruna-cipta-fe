"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, Trash2, Plus, Circle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type User } from "@/constants/users";
import { cn } from "@/lib/utils";

export const columns = ({
    onCreate,
    onView,
    onEdit,
    onDeleteSingle,
    onUpdateStatus,
}: {
    onCreate: () => void;
    onView: (u: User) => void;
    onEdit: (u: User) => void;
    onDeleteSingle: (u: User) => void;
    onUpdateStatus: (index: number, active: boolean) => void;
}): ColumnDef<User>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <div className="w-fit pl-2 flex items-center justify-center">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-fit pl-2 flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                />
            </div>
        ),
        size: 30, 
        enableHiding: false,
    },
    {
        id: "user_identity",
        header: () => <div className="pl-0 font-bold text-slate-900">User Identity</div>,
        size: 300,
        cell: ({ row }) => {
            const u = row.original;
            const initial = u.username?.charAt(0).toUpperCase() || "?";

            return (
                <div className="flex items-center gap-3 py-3 pl-0 group/cell">
                    <div className={cn(
                        "h-11 w-11 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                        u.is_superadmin 
                            ? "bg-arcipta-blue-primary/10 border-arcipta-blue-primary/20 text-arcipta-blue-primary group-hover/cell:bg-arcipta-blue-primary/20" 
                            : "bg-slate-100 border-slate-200 text-slate-500 group-hover/cell:border-arcipta-blue-primary/40 group-hover/cell:bg-arcipta-blue-primary/5"
                    )}>
                        <span className="font-bold text-xs font-orbitron">{initial}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight transition-colors duration-300 group-hover/cell:text-arcipta-blue-primary">
                            {u.username}
                        </h4>
                        <p className={cn(
                            "text-[9px] font-black uppercase tracking-[0.2em] leading-none transition-colors duration-300",
                            u.is_superadmin ? "text-arcipta-blue-primary" : "text-slate-400 group-hover/cell:text-slate-500"
                        )}>
                            AS {u.is_superadmin ? "SUPERADMIN" : "ADMIN"}
                        </p>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "is_active",
        header: () => <div className="font-bold text-slate-900">Status</div>,
        size: 150,
        cell: ({ row }) => {
            const isActive = row.original.is_active;
            return (
                <div className="flex items-center gap-3">
                    <Switch
                        checked={isActive}
                        onCheckedChange={(val) => onUpdateStatus(row.index, val)}
                        className="data-[state=checked]:bg-arcipta-blue-primary scale-90"
                    />
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "px-2.5 py-0.5 rounded-full border font-bold text-[9px] uppercase tracking-wider gap-1.5 transition-all duration-300",
                            isActive 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                : "bg-slate-50 text-slate-400 border-slate-200"
                        )}
                    >
                        <Circle className={cn("size-1.5 fill-current", isActive ? "animate-pulse" : "")} />
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
            );
        }
    },
    {
        accessorKey: "created_at",
        header: () => <div className="font-bold text-slate-900">Activity Log</div>,
        size: 180,
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <div className="flex flex-col gap-0.5 min-w-[140px] group/log">
                    <span className="text-[11px] font-bold text-slate-700 font-satoshi transition-colors duration-300 group-hover/cell:text-slate-900">
                        {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold transition-colors duration-300 group-hover/cell:text-slate-500">
                        {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                </div>
            );
        }
    },
    {
        id: "actions",
        header: () => <div className="pl-2 font-bold text-slate-900">Actions</div>,
        size: 100,
        enableHiding: false,
        cell: ({ row }) => (
            <div className="flex justify-start items-center pl-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-transparent transition-all duration-300 group-hover:text-arcipta-blue-primary"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-42 font-satoshi shadow-xl border-slate-100 p-1">
                        <DropdownMenuItem onClick={onCreate} className="cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" /> Add New 
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView(row.original)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(row.original)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4 text-amber-500" /> Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDeleteSingle(row.original)} 
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];