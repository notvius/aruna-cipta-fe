"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type ActivityLog } from "@/constants/activity_log";
import { userData } from "@/data/users";

export const columns: ColumnDef<ActivityLog>[] = [
    {
        accessorFn: (row) => {
            const user = userData.find((u) => u.id === row.user_id);
            return user ? user.username : `User ${row.user_id}`;
        },
        id: "username",
        header: "User",
        cell: ({ row }) => {
            const username = row.getValue("username") as string;
            return <div className="font-medium text-sm">{username}</div>;
        },
    },
    {
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const action = row.getValue("action") as string;

            const getVariant = () => {
                switch (action.toLowerCase()) {
                    case "created": return "default";
                    case "updated": return "secondary";
                    case "deleted": return "destructive";
                    default: return "outline";
                }
            };

            const getCustomStyle = () => {
                if (action.toLowerCase() === "created") {
                    return { backgroundColor: "var(--arcipta-blue-primary)", color: "white" };
                }
                if (action.toLowerCase() === "updated") {
                    return { backgroundColor: "#f59e0b", color: "white" }; 
                }
                return undefined;
            };

            return (
                <Badge
                    variant={getVariant() as any}
                    className="capitalize"
                    style={getCustomStyle()}
                >
                    {action}
                </Badge>
            );
        },
    },
    {
        accessorKey: "target_type",
        header: "Module",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground font-medium">
                {row.getValue("target_type")}
            </div>
        ),
    },
    {
        accessorKey: "target_id",
        header: "Target ID",
        cell: ({ row }) => (
            <div className="text-sm font-mono text-muted-foreground">
                #{row.getValue("target_id")}
            </div>
        ),
    },
    {
        accessorKey: "ip_address",
        header: "IP Address",
        cell: ({ row }) => (
            <div className="text-xs font-mono text-muted-foreground">
                {row.getValue("ip_address")}
            </div>
        ),
    },
    {
        accessorKey: "user_agent",
        header: "Browser / OS",
        cell: ({ row }) => (
            <div className="text-xs text-muted-foreground max-w-[200px] truncate" title={row.getValue("user_agent")}>
                {row.getValue("user_agent")}
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="font-semibold p-0 hover:bg-transparent"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Timestamp
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return (
                <div className="text-sm whitespace-nowrap">
                    {date.toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            );
        },
    },
];
