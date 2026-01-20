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
import { type Testimonial } from "@/constants/testimonials";

interface ViewTestimonialModalProps {
    testimonial: Testimonial;
}

export function ViewTestimonialModal({ testimonial }: ViewTestimonialModalProps) {
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
                    <DialogTitle className="text-xl font-bold">Testimonial Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Client Name */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Client Name</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {testimonial.clientName}
                        </p>
                    </div>

                    {/* Client Title */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Client Title</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {testimonial.clientTitle}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {testimonial.content}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                        {/* Status */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                            <div>
                                <Badge
                                    className={testimonial.status.toLowerCase() === 'published' ? 'bg-green-600' : ''}
                                    variant={testimonial.status.toLowerCase() === 'published' ? 'default' : 'secondary'}
                                >
                                    {testimonial.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Updated At */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                            <p className="text-sm">{formatDate(testimonial.updatedAt)}</p>
                        </div>

                        {/* Created At */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                            <p className="text-sm">{formatDate(testimonial.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
