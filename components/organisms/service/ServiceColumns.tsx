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
import { type Service } from "@/constants/services";
import { EditServiceModal } from "./EditServiceModal";
import { ViewServiceModal } from "./ViewServiceModal";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";

const truncateWords = (text: string | null | undefined, count: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= count) return text;
    return words.slice(0, count).join(" ") + "...";
};

export const columns: ColumnDef<Service>[] = [
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
        accessorKey: "title",
        header: "Title",
        cell: ({ row, table }) => (
            <div className="group flex items-center gap-1 justify-between max-w-[200px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("title"), 10)}
                </div>
                <EditServiceModal
                    initialContent={row.getValue("title")}
                    onSave={(newTitle) => table.options.meta?.updateData(row.index, "title", newTitle)}
                    title={`Edit Title: ${row.original.title}`}
                    type="text"
                />
            </div>
        ),
    },
    {
        accessorKey: "content",
        header: "Content",
        cell: ({ row, table }) => (
            <div className="group flex items-center gap-1 justify-between max-w-[200px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("content"), 10)}
                </div>
                <EditServiceModal
                    initialContent={row.getValue("content")}
                    onSave={(newContent) => table.options.meta?.updateData(row.index, "content", newContent)}
                    title={`Edit Content: ${row.original.content}`}
                    type="text"
                />
            </div>
        ),
    },
    {
        accessorKey: "icon",
        header: "Icon",
        cell: ({ row, table }) => (
            <div className="group flex items-center gap-1 justify-between max-w-[200px]">
                <div className="flex items-center gap-2">
                    <DynamicIcon name={row.getValue("icon")} className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                        {row.getValue("icon")}
                    </span>
                </div>
                <EditServiceModal
                    initialContent={row.getValue("icon")}
                    onSave={(newIcon) => table.options.meta?.updateData(row.index, "icon", newIcon)}
                    title={`Edit Icon: ${row.original.title}`}
                    type="text"
                />
            </div>
        ),
    },
    {
        accessorKey: "featured_image",
        header: "Image",
        cell: ({ row, table }) => (
            <div className="flex items-center gap-2 min-w-[240px]">
                <img
                    src={row.getValue("featured_image")}
                    alt={row.original.title}
                    className="rounded-md object-cover h-14 w-24 flex-shrink-0"
                />
                <EditServiceModal
                    initialContent={row.getValue("featured_image")}
                    onSave={(newFeaturedImage) => table.options.meta?.updateData(row.index, "featured_image", newFeaturedImage)}
                    title={`Edit Image: ${row.original.featured_image}`}
                    type="image"
                />
            </div>
        ),
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
            const date = new Date(row.getValue("updatedAt"));
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
                        <DropdownMenuItem onClick={() => table.options.meta?.updateData(row.index, "status", "Published")}>
                            Published
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.options.meta?.updateData(row.index, "status", "Unpublished")}>
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
            const service = row.original;
            return (
                <div className="flex items-center gap-2">
                    <ViewServiceModal service={service} />
                </div>
            );
        },
    },
];
