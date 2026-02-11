"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, PlusCircle, Eye, Trash2, Calendar, MonitorPlay, Globe, Lock } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Article, type ArticleCategory } from "@/constants/articles";

export const columns = (
    onAddNew: () => void,
    onView: (article: Article) => void,
    onEdit: (article: Article) => void,
    onDelete: (article: Article) => void,
    onPreview: (article: Article) => void,
    onToggleStatus: (article: Article) => void,
    categories: ArticleCategory[]
): ColumnDef<Article>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                />
            ),
            size: 40,
        },
        {
            id: "hybrid_content",
            header: "Article Information",
            cell: ({ row }) => {
                const article = row.original;
                
                const getCategoryName = () => {
                    if (article.category && typeof article.category === 'object') {
                        return article.category.name;
                    }
                    const catId = article.article_category_id;
                    return categories.find(c => String(c.id) === String(catId))?.name || "General";
                };

                const categoryName = getCategoryName();
                const imageUrl = article.thumbnail_url
                    ? `${article.thumbnail_url}?t=${new Date(article.updated_at).getTime()}`
                    : "/images/placeholder.jpg";

                return (
                    <div className="flex items-center gap-4 py-3 min-w-[450px] group/item">
                        <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100">
                            <img
                                src={imageUrl}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                                alt=""
                                key={article.updated_at}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 overflow-hidden">
                            <h4 className="font-bold text-slate-900 truncate text-sm tracking-tight group-hover/item:text-arcipta-blue-primary transition-colors">
                                {article.title.replace(/<[^>]*>/g, '')}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-muted-foreground/80">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 px-1.5 py-0 border-none">{categoryName}</Badge>
                                <span className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(article.created_at).toLocaleDateString('id-ID')}</span>
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
            header: () => <div className="pl-2 font-bold text-slate-900 font-outfit uppercase tracking-wider text-[11px]">Actions</div>,
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex justify-start items-center pl-2 min-w-[80px]">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-slate-100 transition-all duration-300 rounded-full group-hover/row:text-arcipta-blue-primary"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-2xl border-slate-100 p-1.5 font-jakarta bg-white">
                            <DropdownMenuItem onClick={onAddNew} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <PlusCircle className="mr-2 h-4 w-4 text-emerald-500" /> Add New Article
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onView(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPreview(row.original)}><MonitorPlay className="mr-2 h-4 w-4 text-orange-500" /> Live Preview</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <Pencil className="mr-2 h-4 w-4 text-amber-500" /> Edit Article
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onToggleStatus(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium text-arcipta-blue-primary">
                                {row.original.is_published ? <Lock className="mr-2 h-4 w-4" /> : <Globe className="mr-2 h-4 w-4" />}
                                {row.original.is_published ? "Set to Draft" : "Publish to Web"}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => onDelete(row.original)}
                                className="rounded-lg py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Article
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];