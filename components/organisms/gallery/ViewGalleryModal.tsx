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
import { type Gallery } from "@/constants/galleries";

interface ViewGalleryModalProps {
    gallery: Gallery;
}

export function ViewGalleryModal({ gallery }: ViewGalleryModalProps) {
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
                    <DialogTitle className="text-xl font-bold">Gallery Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Image */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Image Preview</span>
                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                            <img
                                src={gallery.file_path}
                                alt={gallery.alt_text || gallery.caption}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground break-all mt-1">
                            {gallery.file_path.startsWith("data:") ? "Uploaded Image (Base64)" : gallery.file_path}
                        </p>
                    </div>

                    {/* Caption */}
                    <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Caption</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {gallery.caption}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                        {/* Status */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                            <div>
                                <Badge
                                    className={gallery.status.toLowerCase() === 'published' ? 'bg-green-600' : ''}
                                    variant={gallery.status.toLowerCase() === 'published' ? 'default' : 'secondary'}
                                >
                                    {gallery.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Updated At */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                            <p className="text-sm">{formatDate(gallery.updatedAt)}</p>
                        </div>

                        {/* Created At */}
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                            <p className="text-sm">{formatDate(gallery.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
