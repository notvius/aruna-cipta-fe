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
import { type Gallery } from "@/constants/galleries";
import { EditGalleryModal } from "./EditGalleryModal";
import { ViewGalleryModal } from "./ViewGalleryModal";

const truncateWords = (text: string | null | undefined, count: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= count) return text;
    return words.slice(0, count).join(" ") + "...";
};

export const columns: ColumnDef<Gallery>[] = [
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
        accessorKey: "file_path",
        header: "Image",
        cell: ({ row, table }) => (
            <div className="flex items-center gap-2 min-w-[240px]">
                <img
                    src={row.getValue("file_path")}
                    alt={row.getValue("alt_text")}
                    className="rounded-md object-cover h-14 w-24 flex-shrink-0"
                />
                <EditGalleryModal
                    initialContent={row.getValue("file_path")}
                    onSave={(newFilePath) => table.options.meta?.updateData(row.index, "file_path", newFilePath)}
                    title={`Edit Image: ${row.original.caption}`}
                    type="image"
                />
            </div>
        ),
    },
    {
        accessorKey: "caption",
        header: "Caption",
        cell: ({ row, table }) => (
            <div className="group flex items-center gap-1 justify-between max-w-[200px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("caption"), 10)}
                </div>
                <EditGalleryModal
                    initialContent={row.getValue("caption")}
                    onSave={(newCaption) => table.options.meta?.updateData(row.index, "caption", newCaption)}
                    title={`Edit Caption: ${row.original.caption}`}
                />
            </div>
        ),
    },
    {
        accessorKey: "alt_text",
        header: "Alt Text",
        cell: ({ row, table }) => (
            <div className="group flex items-center gap-1 justify-between max-w-[200px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("alt_text"), 10)}
                </div>
                <EditGalleryModal
                    initialContent={row.getValue("alt_text")}
                    onSave={(newAltText) => table.options.meta?.updateData(row.index, "alt_text", newAltText)}
                    title={`Edit Alt Text: ${row.original.caption}`}
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
            if (!dateValue) return <div className="text-center text-muted-foreground">-</div>;
            const date = new Date(dateValue as string);
            return <div className="text-center">{date.toLocaleDateString()}</div>;
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
            const gallery = row.original;
            return (
                <div className="flex items-center gap-2">
                    <ViewGalleryModal gallery={gallery} />
                </div>
            );
        },
    },
];
