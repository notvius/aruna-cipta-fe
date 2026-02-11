"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Gallery } from "@/constants/galleries";
import { cn } from "@/lib/utils";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gallery: Gallery;
}

export function ViewGalleryModal({ open, onOpenChange, gallery }: ViewProps) {
    if (!gallery) return null;

    const formatFullDate = (date: any) => {
        if (!date) return "—";
        return new Date(date).toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "long",
            year: "numeric"
        }) + " WIB";
    };

    const imageUrl = gallery.image_url 
        ? `${gallery.image_url}?t=${new Date(gallery.updated_at).getTime()}` 
        : "/images/placeholder-gallery.jpg";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        Gallery Asset Details
                    </DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[85vh] w-full">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none ml-0.5">Media Preview</p>
                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-50 shadow-inner">
                                <img
                                    src={imageUrl}
                                    alt={gallery.alt_text || "Preview"}
                                    className="w-full h-full object-cover"
                                    key={gallery.updated_at}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none ml-0.5">Caption</p>
                                <h3 className="text-base font-bold text-arcipta-blue-primary leading-relaxed">
                                    {gallery.caption || "Untitled Asset"}
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Status</p>
                                    <div className={cn(
                                        "w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        gallery.is_published 
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
                                            : "bg-slate-100 border-slate-200 text-slate-500"
                                    )}>
                                        {gallery.is_published ? "Published" : "Draft"}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Alt Text</p>
                                    <p className="text-sm font-medium text-slate-600 truncate">
                                        {gallery.alt_text || "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Created At</span>
                                    <span className="font-semibold text-slate-700 text-[11px]">
                                        {formatFullDate(gallery.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Last Update</span>
                                    <span className="font-semibold text-slate-700 text-[11px]">
                                        {formatFullDate(gallery.updated_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}