"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Plus, Eye, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type User } from "@/constants/users";

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
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        size: 40,
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => <div className="font-medium text-sm">{row.getValue("username")}</div>,
    },
    {
        accessorKey: "is_superadmin",
        header: "Role",
        cell: ({ row }) => {
            const isSuper = row.getValue("is_superadmin") as boolean;
            return (
                <Badge variant={isSuper ? "default" : "secondary"} className={isSuper ? "bg-arcipta-blue-primary" : ""}>
                    {isSuper ? "Superadmin" : "Admin"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Switch
                    checked={row.getValue("is_active")}
                    onCheckedChange={(val) => onUpdateStatus(row.index, val)}
                    className="data-[state=checked]:bg-arcipta-blue-primary"
                />
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
            const u = row.original;
            return (
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-fit p-0 hover:bg-transparent">
                                <Badge variant="outline" className="cursor-pointer bg-arcipta-blue-primary text-white py-1">
                                    Action <ChevronDown className="ml-1 h-3 w-3" />
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={onCreate}><Plus className="mr-2 h-4 w-4" /> Create New</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(u)}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(u)}><Pencil className="mr-2 h-4 w-4" /> Edit User</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteSingle(u)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];