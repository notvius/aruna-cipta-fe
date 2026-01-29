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
        size: 50,
    },
    {
        accessorKey: "file_path",
        header: "Image",
        size: 140,
        cell: ({ row }) => (
            <div className="flex items-center justify-center md:justify-start md:w-24 md:h-16 
                    transition-all duration-200">
                <img
                    src={row.getValue("file_path")}
                    alt={row.getValue("alt_text")}
                    className="rounded-md object-cover h-14 w-24"
                />
            </div>
        ),
    },
    {
        accessorKey: "caption",
        header: "Caption",
        size: 280,
        cell: ({ row }) => (
            <div className="group flex items-center gap-1 justify-between max-w-[200px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("caption"), 15)}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "alt_text",
        header: "Alt Text",
        size: 220,
        cell: ({ row }) => (
            <div className="group flex items-center gap-1 justify-between max-w-[200px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("alt_text"), 10)}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="font-semibold h-auto p-0 hover:bg-transparent"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        size: 150,
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return <div className="px-4">{date.toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="font-semibold h-auto p-0 hover:bg-transparent"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Updated At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        size: 150,
        cell: ({ row }) => {
            const dateValue = row.getValue("updated_at");
            if (!dateValue) return <div className="text-center text-muted-foreground">-</div>;
            const date = new Date(dateValue as string);
            return <div className="px-4">{date.toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "is_published",
        header: "Status",
        size: 140,
        cell: ({ row, table }) => {
            const isPublished = row.getValue("is_published") as boolean;
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
                                {isPublished ? "Published" : "Unpublished"}
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => table.options.meta?.updateData(row.index, "is_published", true)}>
                            Published
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.options.meta?.updateData(row.index, "is_published", false)}>
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
        size: 120,
        enableHiding: false,
        cell: ({ row, table }) => {
            const gallery = row.original;
            return (
                <div className="flex gap-2">
                    <ViewGalleryModal gallery={gallery} />
                    <EditGalleryModal
                        gallery={gallery}
                        onSave={(updatedGallery) => table.options.meta?.updateRow(row.index, updatedGallery)}
                    />
                </div>
            );
        },
    },
];