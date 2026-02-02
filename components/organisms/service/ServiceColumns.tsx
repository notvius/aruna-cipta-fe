"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    ArrowUpDown,
} from "lucide-react";
import { type Service } from "@/constants/services";
import { EditServiceModal } from "./EditServiceModal";
import { ViewServiceModal } from "./ViewServiceModal";

const truncateWords = (text: string | null | undefined, count: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= count) return text;
    return words.slice(0, count).join(" ") + "...";
};

const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
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
        accessorKey: "featured_image",
        header: "Image",
        size: 100,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 min-w-[100px]">
                <img
                    src={row.getValue("featured_image")}
                    alt={row.original.title}
                    className="rounded-md object-cover h-14 w-24 flex-shrink-0"
                />
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
        size: 200,
        cell: ({ row }) => (
            <div className="group flex items-center gap-1 justify-between max-w-[200px]">
                <div className="text-sm text-muted-foreground whitespace-normal break-words">
                    {truncateWords(row.getValue("title"), 10)}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "content",
        header: "Content",
        size: 240,
        cell: ({ row }) => {
            const rawContent = row.getValue("content") as string;
            const plainText = stripHtml(rawContent);

            return (
                <div className="group flex items-center gap-1 justify-between max-w-[240px]">
                    <div className="text-sm text-muted-foreground whitespace-normal break-words">
                        {truncateWords(plainText, 10)}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        id: "actions",
        header: "Action",
        enableHiding: false,
        cell: ({ row, table }) => {
            const service = row.original;
            return (
                <div className="flex items-center gap-2">
                    <ViewServiceModal service={service} />
                    <EditServiceModal
                        service={service}
                        onSave={(updatedService) => table.options.meta?.updateRow(row.index, updatedService)}
                    />
                </div>
            );
        },
    },
];
