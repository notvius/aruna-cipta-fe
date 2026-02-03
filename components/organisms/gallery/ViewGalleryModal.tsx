"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Gallery } from "@/constants/galleries";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gallery: Gallery;
}

export function ViewGalleryModal({ open, onOpenChange, gallery }: ViewProps) {
    const format = (d: Date | string | null | undefined) => {
        if (!d) return "—";
        const date = d instanceof Date ? d : new Date(d);
        return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString("id-ID", {
            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
        });
    };

    const Field = ({ label, value, full, isImage }: { label: string; value: string; full?: boolean; isImage?: boolean }) => (
        <div className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
            {isImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted/30 p-2 mt-1">
                    <img
                        src={value}
                        alt="Gallery Preview"
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
            ) : (
                <div className={full ? "text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border mt-1" : "text-sm text-foreground"}>
                    {value || <span className="italic text-muted-foreground">No data</span>}
                </div>
            )}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Gallery Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    {/* Kolom Kiri: Preview Gambar */}
                    <div className="flex flex-col gap-4">
                        <Field label="Image Preview" value={gallery.file_path} isImage />
                    </div>

                    {/* Kolom Kanan: Detail Data */}
                    <div className="flex flex-col gap-6">
                        <div className="space-y-6 pt-2 border-t md:border-t-0">
                            <Field label="Caption" value={gallery.caption} full />
                            
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                                    <div>
                                        <Badge className={gallery.is_published ? "bg-arcipta-blue-primary" : "bg-slate-500"}>
                                            {gallery.is_published ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                </div>
                                <Field label="Alt Text" value={gallery.alt_text} />
                            </div>
                        </div>

                        <div className="col-span-2 grid grid-cols-2 gap-4 pt-4 border-t">
                            <Field label="Created At" value={format(gallery.created_at)} />
                            <Field label="Updated At" value={format(gallery.updated_at)} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}