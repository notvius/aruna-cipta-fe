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
import { type Testimonial } from "@/constants/testimonials";

interface ViewTestimonialModalProps {
    testimonial: Testimonial;
}

export function ViewTestimonialModal({ testimonial }: ViewTestimonialModalProps) {
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
                    <DialogTitle className="text-xl font-bold">Testimonial Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Client Name & Client Title */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Client Name</span>
                            <p className="text-xs text-foreground">{testimonial.client_name || ""}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Client Title</span>
                            <p className="text-xs text-foreground">{testimonial.client_title || ""}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</span>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                            {testimonial.content || <span className="italic text-muted-foreground">No content provided</span>}
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                            <p className="text-xs text-foreground">{formatDate(testimonial.created_at)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                            <p className="text-xs text-foreground">{formatDate(testimonial.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
