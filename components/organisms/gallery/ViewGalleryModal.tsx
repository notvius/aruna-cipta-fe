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
import { type Gallery } from "@/constants/galleries";

interface ViewGalleryModalProps {
    gallery: Gallery;
}

export function ViewGalleryModal({ gallery }: ViewGalleryModalProps) {
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
                    <DialogTitle className="text-xl font-bold">Gallery Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    
                    {/* Kolom Kiri: Preview Gambar */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Image Preview</span>
                            <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                <img
                                    src={gallery.file_path}
                                    alt={gallery.alt_text || gallery.caption}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Detail & Meta Data */}
                    <div className="space-y-6">
                        {/* Caption */}
                        <div className="flex flex-col gap-2 pt-2 border-t text-muted-foreground">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Caption</span>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border">
                                {gallery.caption || <span className="italic text-muted-foreground">No caption provided</span>}
                            </div>
                        </div>

                        {/* Status & Alt Text */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                                <div>
                                    <Badge
                                        className={gallery.is_published ? 'bg-green-600 hover:bg-green-700' : ''}
                                        variant={gallery.is_published ? 'default' : 'secondary'}
                                    >
                                        {gallery.is_published ? 'Published' : 'Unpublished'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Alt Text</span>
                                <p className="text-sm text-foreground">{gallery.alt_text || "—"}</p>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created At</span>
                                <p className="text-xs text-foreground">{formatDate(gallery.created_at)}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Updated At</span>
                                <p className="text-xs text-foreground">{formatDate(gallery.updated_at)}</p>
                            </div>
                            {gallery.deleted_at && (
                                <div className="flex flex-col gap-1 col-span-2">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-red-500">Deleted At</span>
                                    <p className="text-xs text-red-500 italic">{formatDate(gallery.deleted_at)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}