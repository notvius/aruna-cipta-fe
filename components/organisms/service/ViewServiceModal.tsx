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
import { type Service } from "@/constants/services";

interface ViewServiceModalProps {
    service: Service;
}

export function ViewServiceModal({ service }: ViewServiceModalProps) {
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
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Service Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    
                    {/* Kolom Kiri: Preview Gambar */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Image Preview</span>
                            <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                <img
                                    src={service.featured_image}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Detail & Meta Data */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Title</span>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                {service.title || <span className="italic text-muted-foreground">No title provided</span>}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</span>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: service.content || "<i>No content provided</i>" }}
                            />
                        </div>

                        {/* Timestamps */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                                <p className="text-xs text-foreground">{formatDate(service.created_at)}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                                <p className="text-xs text-foreground">{formatDate(service.updated_at)}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}