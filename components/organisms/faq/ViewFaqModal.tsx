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
import { type Faq } from "@/constants/faqs";

interface ViewFaqModalProps {
    faq: Faq;
}

export function ViewFaqModal({ faq }: ViewFaqModalProps) {
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
                    <DialogTitle className="text-xl font-bold">FAQ Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Question & Answer */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Question</span>
                            <p className="text-sm text-foreground">{faq.question || ""}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Answer</span>
                            <p className="text-sm text-foreground">{faq.answer || ""}</p>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                            <p className="text-xs text-foreground">{formatDate(faq.created_at)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                            <p className="text-xs text-foreground">{formatDate(faq.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
