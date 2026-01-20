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
import { type Article } from "@/constants/articles";
import { EditContentModal } from "./EditContentModal";
import { ViewArticleModal } from "./ViewArticleModal";

const truncateWords = (text: string, count: number) => {
    const words = text.split(" ");
    if (words.length <= count) return text;
    return words.slice(0, count).join(" ") + "...";
};

export const columns: ColumnDef<Article>[] = [
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
        accessorKey: "thumbnail",
        header: "Thumbnail",
        cell: ({ row }) => (
            <div className="w-[80px]">
                <img
                    src={row.getValue("thumbnail")}
                    alt={row.getValue("title")}
                    className="rounded-md object-cover h-10 w-16"
                />
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-3" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <Badge variant="secondary">
                {row.getValue("category")}
            </Badge>
        ),
    },
    {
        accessorKey: "content",
        header: "Content",
        cell: ({ row, table }) => (
            <div className="group flex items-center justify-between gap-2 max-w-[300px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("content"), 10)}
                </div>
                <EditContentModal
                    initialContent={row.getValue("content")}
                    onSave={(newContent) => table.options.meta?.updateData(row.index, "content", newContent)}
                    title={`Edit Content: ${row.original.title}`}
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
        accessorKey: "publishedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="font-semibold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Published At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const dateValue = row.getValue("publishedAt");
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
            const article = row.original;
            return (
                <div className="flex items-center gap-2">
                    <ViewArticleModal article={article} />
                </div>
            );
        },
    },
];
