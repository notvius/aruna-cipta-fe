"use client";

import * as React from "react";
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

interface ViewArticleModalProps {
    article: Article;
}

export function ViewArticleModal({ article }: ViewArticleModalProps) {
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Article Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Thumbnail */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Thumbnail</span>
                        <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="w-full aspect-video object-cover rounded-lg border shadow-sm"
                        />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Title</span>
                        <p className="text-lg font-medium leading-tight">{article.title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category</span>
                            <div>
                                <Badge variant="secondary">{article.category}</Badge>
                            </div>
                        </div>

                        {/* Views */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Views</span>
                            <p className="text-lg font-medium">{(article.views ?? 0).toLocaleString("id-ID")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                            <div>
                                <Badge
                                    className={article.status.toLowerCase() === 'published' ? 'bg-green-600' : ''}
                                    variant={article.status.toLowerCase() === 'published' ? 'default' : 'secondary'}
                                >
                                    {article.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Updated At */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                            <p className="text-sm">{formatDate(article.updatedAt)}</p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                            <p className="text-sm">{formatDate(article.createdAt)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Published At</span>
                            <p className="text-sm">{formatDate(article.publishedAt)}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {article.content}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
