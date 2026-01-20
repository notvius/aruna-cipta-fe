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
import { type Faq } from "@/constants/faqs";

interface ViewFaqModalProps {
    faq: Faq;
}

export function ViewFaqModal({ faq }: ViewFaqModalProps) {
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
                    <DialogTitle className="text-xl font-bold">Faq Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Question */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Question</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {faq.question}
                        </p>
                    </div>

                    {/* Answer */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Answer</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {faq.answer}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                        {/* Status */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                            <div>
                                <Badge
                                    className={faq.status.toLowerCase() === 'published' ? 'bg-green-600' : ''}
                                    variant={faq.status.toLowerCase() === 'published' ? 'default' : 'secondary'}
                                >
                                    {faq.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Updated At */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                            <p className="text-sm">{formatDate(faq.updatedAt)}</p>
                        </div>

                        {/* Created At */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                            <p className="text-sm">{formatDate(faq.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
