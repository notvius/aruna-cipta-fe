"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { type ArticleCategory } from "@/constants/article_category";

interface ViewArticleCategoryModalProps {
    articleCategory: ArticleCategory;
}

export function ViewArticleCategoryModal({ articleCategory }: ViewArticleCategoryModalProps) {
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
                    <DialogTitle className="text-xl font-bold">Article Category Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Name */}
                    <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Name</span>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                {articleCategory.name || <span className="italic text-muted-foreground">No name provided</span>}
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                            <p className="text-xs text-foreground">{formatDate(articleCategory.created_at)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                            <p className="text-xs text-foreground">{formatDate(articleCategory.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
