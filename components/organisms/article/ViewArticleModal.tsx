"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { type Article } from "@/constants/articles";
import { getArticleCategories } from "@/utils/article-category-storage";

interface ViewArticleModalProps {
    article: Article;
}

const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

export function ViewArticleModal({ article }: ViewArticleModalProps) {
    function formatDate(date: Date | string | null | undefined): string {
        if (!date) return "—";
        const parsedDate = date instanceof Date ? date : new Date(date);
        if (isNaN(parsedDate.getTime())) return "Invalid date";

        return parsedDate.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    const categories = getArticleCategories();
    const categoryIds = Array.isArray(article.category) ? article.category : [article.category];

    const categoryNames = categoryIds.map((catId: number) =>
        categories.find(c => c.id === catId)?.name || catId
    ).join(", ");

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-arcipta-blue-primary hover:text-arcipta-blue-primary/90"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Article Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    
                    {/* --- KOLOM KIRI: Thumbnail & Metadata --- */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Thumbnail</span>
                            <img
                                src={article.thumbnail}
                                alt={article.title}
                                className="w-full aspect-video object-cover rounded-lg border shadow-sm"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category</span>
                                <div>
                                    <Badge variant="secondary">{categoryNames || "-"}</Badge>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Views</span>
                                <p className="text-lg font-medium">{(article.view_count ?? 0).toLocaleString("id-ID")}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                                <div>
                                    <Badge
                                        className={article.is_published ? 'bg-green-600' : ''}
                                        variant={article.is_published ? 'default' : 'secondary'}
                                    >
                                        {article.is_published ? 'Published' : 'Unpublished'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                                <p className="text-xs text-foreground">{formatDate(article.created_at)}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Published At</span>
                                <p className="text-xs text-foreground">{formatDate(article.published_at)}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                                <p className="text-xs text-foreground">{formatDate(article.updated_at)}</p>
                            </div>
                            {article.deleted_at && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-red-500">Deleted At</span>
                                    <p className="text-xs text-red-500 italic">{formatDate(article.deleted_at)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- KOLOM KANAN: Title & Content --- */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Title</span>
                            <div className="text-lg font-bold leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">{stripHtml(article.title)}</div>
                        </div>

                        <div className="flex flex-col gap-2 pt-4 text-muted-foreground">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</span>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                {stripHtml(article.content)}
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}