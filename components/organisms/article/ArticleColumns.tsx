"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    Pencil,
    Plus,
    Eye,
    Trash2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Article } from "@/constants/articles";
import { ViewArticleModal } from "./ViewArticleModal";
import { getArticleCategories } from "@/utils/article-category-storage";
import Link from "next/link";

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

export const columns = (
    onDeleteSingle: (article: Article) => void
): ColumnDef<Article>[] => [
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
        header: "Title",
        cell: ({ row }) => {
            const rawContent = row.getValue("title") as string;
            const plainText = stripHtml(rawContent);

            return (
                <div className="group flex items-center gap-1 justify-between max-w-[240px]">
                    <div className="text-sm text-muted-foreground whitespace-normal break-words">
                        {truncateWords(plainText, 5)}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const categories = row.getValue("category") as number[];
            const allCategories = typeof window !== 'undefined' ? getArticleCategories() : [];

            const categoryNames = Array.isArray(categories)
                ? categories.map(catId =>
                    allCategories.find(c => c.id === catId)?.name || catId
                ).join(", ")
                : categories;

            return (
                <Badge variant="secondary">
                    {categoryNames}
                </Badge>
            );
        },
    },
    {
        accessorKey: "content",
        header: "Content",
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
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        id: "actions",
        header: "Action",
        enableHiding: false,
        cell: ({ row }) => {
            const article = row.original;

            return (
            <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                        variant="ghost"
                        className="h-fit p-0 hover:bg-transparent focus-visible:ring-0"
                        >
                            <Badge
                                variant="outline"
                                className="cursor-pointer font-medium bg-arcipta-blue-primary text-white border-muted-foreground/20 py-1"
                            >
                                Action
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                        {/* Create */}
                        <DropdownMenuItem asChild>
                            <Link href="/article/create" className="flex items-center w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Create New</span>
                            </Link>
                        </DropdownMenuItem>

                        {/* View */}
                        <ViewArticleModal article={article}>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                            </DropdownMenuItem>
                        </ViewArticleModal>

                        {/* Edit */}
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/article/${article.id}/edit`}
                                className="flex items-center w-full"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit Article</span>
                            </Link>
                        </DropdownMenuItem>

                        {/* Delete */}
                        <DropdownMenuItem
                            className="flex items-center text-red-600 focus:text-red-600"
                            onClick={() => onDeleteSingle(article)}
                            >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            );
        },
    }
];
