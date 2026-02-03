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
import { type Faq } from "@/constants/faqs";

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
    onView: (f: Faq) => void;
    onEdit: (f: Faq) => void;
    onDeleteSingle: (f: Faq) => void;
}): ColumnDef<Faq>[] => [
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
        accessorKey: "question",
        header: "Question",
        cell: ({ row }) => (
            <div className="text-sm font-medium whitespace-normal break-words w-[200px]">
                {truncate(row.getValue("question"), 10)}
            </div>
        ),
    },
    {
        accessorKey: "answer",
        header: "Answer",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground whitespace-normal break-words max-w-[400px]">
                {truncate(row.getValue("answer"), 15)}
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
            const f = row.original;
            return (
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-fit p-0 hover:bg-transparent shadow-none border-none">
                                <Badge variant="outline" className="cursor-pointer bg-arcipta-blue-primary text-white py-1">
                                    Action <ChevronDown className="ml-1 h-3 w-3" />
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={onCreate}>
                                <Plus className="mr-2 h-4 w-4" /> Create New
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(f)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(f)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit FAQ
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => onDeleteSingle(f)}
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