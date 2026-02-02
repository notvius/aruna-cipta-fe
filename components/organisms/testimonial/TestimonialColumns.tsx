"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Plus, Eye, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Testimonial } from "@/constants/testimonials";

const truncate = (text: string, count: number) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= count ? text : words.slice(0, count).join(" ") + "...";
};

export const columns = ({
    onCreate,
    onView,
    onEdit,
    onDeleteSingle,
}: {
    onCreate: () => void;
    onView: (t: Testimonial) => void;
    onEdit: (t: Testimonial) => void;
    onDeleteSingle: (t: Testimonial) => void;
}): ColumnDef<Testimonial>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        size: 40,
    },
    {
        accessorKey: "client_name",
        header: "Client Name",
        cell: ({ row }) => (
            <div className="text-sm font-medium whitespace-normal break-words w-[180px]">
                {truncate(row.getValue("client_name"), 8)}
            </div>
        ),
    },
    {
        accessorKey: "client_title",
        header: "Client Title",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground whitespace-normal break-words w-[150px]">
                {truncate(row.getValue("client_title"), 8)}
            </div>
        ),
    },
    {
        accessorKey: "content",
        header: "Content",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground whitespace-normal break-words max-w-[450px]">
                {truncate(row.getValue("content"), 20)}
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
            const t = row.original;
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
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={onCreate}>
                                <Plus className="mr-2 h-4 w-4" /> Create New
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(t)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(t)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => onDeleteSingle(t)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];