"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    ArrowUpDown,
    ChevronDown,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Testimonial } from "@/constants/testimonials";
import { EditContentModal } from "./EditContentModal";
import { ViewTestimonialModal } from "./ViewTestimonialModal";

const truncateWords = (text: string, count: number) => {
    const words = text.split(" ");
    if (words.length <= count) return text;
    return words.slice(0, count).join(" ") + "...";
};

export const columns: ColumnDef<Testimonial>[] = [
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
        accessorKey: "clientName",
        header: "Client Name",
        cell: ({ row, table }) => (
            <div className="group flex items-center justify-between gap-2 max-w-[300px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("clientName"), 15)}
                </div>
                <EditContentModal
                    initialContent={row.getValue("clientName")}
                    onSave={(newClientName) => table.options.meta?.updateData(row.index, "clientName", newClientName)}
                    title={`Edit Client Name: ${row.original.clientName}`}
                />
            </div>
        )
    },
    {
        accessorKey: "clientTitle",
        header: "Client Title",
        cell: ({ row, table }) => (
            <div className="group flex items-center justify-between gap-2 max-w-[300px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("clientTitle"), 15)}
                </div>
                <EditContentModal
                    initialContent={row.getValue("clientTitle")}
                    onSave={(newClientTitle) => table.options.meta?.updateData(row.index, "clientTitle", newClientTitle)}
                    title={`Edit Client Title: ${row.original.clientTitle}`}
                />
            </div>
        )
    },
    {
        accessorKey: "content",
        header: "Content",
        cell: ({ row, table }) => (
            <div className="group flex items-center justify-between gap-2 max-w-[300px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("content"), 15)}
                </div>
                <EditContentModal
                    initialContent={row.getValue("content")}
                    onSave={(newContent) => table.options.meta?.updateData(row.index, "content", newContent)}
                    title={`Edit Content: ${row.original.content}`}
                />
            </div>
        )
    },
    {
        accessorKey: "createdAt",
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
            const date = new Date(row.getValue("createdAt"));
            return <div className="px-4">{date.toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Updated At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const dateValue = row.getValue("updatedAt");
            if (!dateValue) return <div className="px-4 text-muted-foreground">-</div>;
            const date = new Date(dateValue as string);
            return <div className="px-4">{date.toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row, table }) => {
            const status = row.getValue("status") as string;
            const isPublished = status.toLowerCase() === "published";
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-fit p-0 hover:bg-transparent">
                            <Badge
                                className="cursor-pointer"
                                variant={isPublished ? "default" : "secondary"}
                                style={
                                    isPublished
                                        ? {
                                            backgroundColor: "var(--arcipta-blue-primary)",
                                            color: "white",
                                        }
                                        : undefined
                                }
                            >
                                {status}
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem
                            onClick={() => table.options.meta?.updateData(row.index, "status", "Published")}
                            disabled={isPublished}
                        >
                            Published
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => table.options.meta?.updateData(row.index, "status", "Unpublished")}
                            disabled={!isPublished}
                        >
                            Unpublished
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
    {
        id: "actions",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const testimonial = row.original;
            return (
                <div className="flex items-center gap-2">
                    <ViewTestimonialModal testimonial={testimonial} />
                </div>
            );
        },
    },
]