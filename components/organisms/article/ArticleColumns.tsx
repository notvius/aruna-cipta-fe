"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Plus, Eye, Trash2, Calendar, MonitorPlay } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Article } from "@/constants/articles";
import { getArticleCategories } from "@/utils/article-category-storage";

export const columns = (
    onAddNew: () => void,
    onView: (article: Article) => void,
    onEdit: (article: Article) => void,
    onDelete: (article: Article) => void,
    onPreview: (article: Article) => void
): ColumnDef<Article>[] => [
    { accessorKey: "created_at", header: "Created At", enableHiding: false },
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
        ),
        size: 40,
        enableHiding: false,
    },
    {
        id: "hybrid_content",
        header: "Article Information",
        enableHiding: false,
        cell: ({ row }) => {
            const article = row.original;
            const categories = getArticleCategories();
            const categoryName = categories.find(c => c.id === article.category[0])?.name || "General";
            
            return (
                <div className="flex items-center gap-4 py-3 min-w-[450px]">
                    <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100 transition-colors duration-300 group-hover:border-arcipta-blue-primary/50">
                        <img 
                            src={article.thumbnail} 
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
                            alt={article.title} 
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 overflow-hidden">
                        <h4 className="font-bold text-slate-900 truncate text-sm tracking-tight transition-colors duration-300 group-hover:text-arcipta-blue-primary">
                            {article.title.replace(/<[^>]*>/g, '')}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-muted-foreground/80">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 px-1.5 py-0 border-none group-hover:bg-arcipta-blue-primary/10 group-hover:text-arcipta-blue-primary transition-colors">{categoryName}</Badge>
                            <span className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(article.created_at).toLocaleDateString()}</span>
                            <Badge variant={article.is_published ? "default" : "outline"} className={article.is_published ? "bg-arcipta-blue-primary h-4 text-[9px]" : "h-4 text-[9px]"}>
                                {article.is_published ? "PUBLISHED" : "DRAFT"}
                            </Badge>
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-transparent rounded-lg transition-all duration-300 group-hover:border-arcipta-blue-primary/40 group-hover:text-arcipta-blue-primary"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 font-satoshi shadow-xl border-slate-100">
                    <DropdownMenuItem onClick={onAddNew}><Plus className="mr-2 h-4 w-4" /> Add New</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onView(row.original)}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPreview(row.original)}><MonitorPlay className="mr-2 h-4 w-4 text-orange-500" /> Live Preview</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(row.original)}><Pencil className="mr-2 h-4 w-4 text-amber-500" /> Edit Article</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete Article</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];