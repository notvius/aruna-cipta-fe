"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    ArrowUpDown,
    Pencil,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { type User } from "@/constants/users";
import { EditUserModal } from "./EditUserModal";
import { ViewUserModal } from "./ViewUserModal";

export const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
            <div className="font-medium text-sm">
                {row.getValue("username")}
            </div>
        ),
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
        cell: ({ row, table }) => {
            const isActive = row.getValue("is_active") as boolean;
            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={isActive}
                        onCheckedChange={(value) =>
                            table.options.meta?.updateData(row.index, "is_active", value)
                        }
                        className="data-[state=checked]:bg-arcipta-blue-primary"
                    />
                    <span className="text-xs text-muted-foreground w-12">
                        {isActive ? "Active" : "Inactive"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const dateValue = row.getValue("created_at");
            if (!dateValue) return <div className="px-4 text-muted-foreground">-</div>;
            const date = new Date(dateValue as string);
            return <div className="px-4 text-sm">{date.toLocaleDateString()}</div>;
        },
    },
    {
        id: "actions",
        header: "Action",
        enableHiding: false,
        cell: ({ row, table }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-2">
                    <ViewUserModal user={user} />
                    <EditUserModal
                        user={user}
                        onSave={(updatedUser) => table.options.meta?.updateRow(row.index, updatedUser)}
                    />
                </div>
            );
        },
    },
];
