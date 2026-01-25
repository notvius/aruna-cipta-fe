"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type ArticleCategory } from "@/constants/article_category";
import { EditArticleCategoryModal } from "./EditArticleCategoryModal";
import { ViewArticleCategoryModal } from "./ViewArticleCategoryModal";

const truncateWords = (text: string, count: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= count) return text;
    return words.slice(0, count).join(" ") + "...";
};

export const columns: ColumnDef<ArticleCategory>[] = [
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
        size: 40, 
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        size: 180, 
        cell: ({ row }) => (
            <div className="text-sm font-medium whitespace-normal break-words w-[180px] pr-">
                {truncateWords(row.getValue("name"), 8)}
            </div>
        )
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
        size: 140,
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return <div className="px-4 text-sm w-[160px]">{date.toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "updated_at",
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
        size: 140,
        cell: ({ row }) => {
            const dateValue = row.getValue("updated_at");
            if (!dateValue) return <div className="px-4 text-muted-foreground w-[140px]">-</div>;
            const date = new Date(dateValue as string);
            return <div className="px-4 text-sm w-[140px]">{date.toLocaleDateString()}</div>;
        },
    },
    {
        id: "actions",
        header: "Action",
        size: 100,
        enableHiding: false,
        cell: ({ row, table }) => {
            const articleCategory = row.original;
            return (
                <div className="flex items-center justify-start gap-1">
                    <ViewArticleCategoryModal articleCategory={articleCategory} />
                    <EditArticleCategoryModal
                        articleCategory={articleCategory}
                        onSave={(updatedArticleCategory) => table.options.meta?.updateRow(row.index, updatedArticleCategory)}
                    />
                </div>
            );
        },
    },
]