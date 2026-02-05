"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Service } from "@/constants/services";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service: Service;
}

export function ViewServiceModal({ open, onOpenChange, service }: ViewProps) {
    if (!service) return null;

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

    const labelStyle = "text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-3 block";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-8 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        Service Details
                    </DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[85vh] w-full">
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            
                            {/* Kolom Kiri: Visual & Timestamps */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className={labelStyle}>Featured Image</span>
                                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                                        <img
                                            src={service.featured_image}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 text-[11px]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground font-bold uppercase tracking-tighter">Created At</span>
                                        <span className="font-medium text-black">
                                            {formatFullDate(service.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground font-bold uppercase tracking-tighter">Last Update At</span>
                                        <span className="font-medium text-black">
                                            {formatFullDate(service.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Kolom Kanan: Title & Content Container */}
                            <div className="space-y-8 h-full">
                                <div className="space-y-1">
                                    <span className={labelStyle}>Service Title</span>
                                    <h3 className="text-2xl font-bold font-orbitron uppercase tracking-tighter text-arcipta-blue-primary">
                                        {service.title}
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <span className={labelStyle}>Content</span>
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
                                        <div className="prose prose-sm prose-slate max-w-none 
                                            prose-p:leading-relaxed prose-p:text-slate-600
                                            prose-strong:text-slate-900 prose-strong:font-bold
                                            prose-ul:list-disc prose-ol:list-decimal"
                                            dangerouslySetInnerHTML={{ __html: service.content || "<i>No description provided</i>" }}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}