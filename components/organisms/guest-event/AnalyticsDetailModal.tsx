"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    data: any;
}

export function AnalyticsDetailModal({ open, onOpenChange, title, data }: Props) {
    if (!data) return null;

    const formatLabel = (key: string) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const filteredEntries = Object.entries(data).filter(([key]) => {
        const k = key.toLowerCase();
        return k !== 'id' && !k.endsWith('_id');
    });

    const isArticleFlow = data.event_subtype?.toLowerCase().includes("article");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[80vh] w-full">
                    <div className="p-8 pt-2 space-y-8">
                        {isArticleFlow && (
                            <div className="flex items-center justify-between py-4 border-y border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Start</span>
                                </div>
                                <div className="h-[1px] flex-1 mx-4 bg-slate-100" />
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Finish</span>
                                </div>
                                <div className="h-[1px] flex-1 mx-4 bg-slate-100" />
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Complete</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                            {filteredEntries.map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                        {formatLabel(key)}
                                    </p>
                                    <p className="text-[12px] font-bold text-slate-700 leading-tight break-words">
                                        {value?.toString() || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}