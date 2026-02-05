"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Faq } from "@/constants/faqs";

export function ViewFaqModal({ open, onOpenChange, faq }: { open: boolean; onOpenChange: (open: boolean) => void; faq: Faq }) {
    if (!faq) return null;

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        FAQ Details
                    </DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[85vh] w-full">
                    <div className="p-6 space-y-8">
=                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-0.5">Question</p>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-satoshi">
                                {faq.question}
                            </h3>
                        </div>

=                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-0.5">Answer</p>
                            <p className="text-base font-medium text-slate-600 leading-relaxed whitespace-pre-wrap font-satoshi">
                                {faq.answer}
                            </p>
                        </div>

                        {/* Metadata Section */}
                        <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 pb-2 text-[11px]">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Created At</span>
                                <span className="font-semibold text-slate-700">
                                    {formatFullDate(faq.created_at)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Last Updated</span>
                                <span className="font-semibold text-slate-700">
                                    {formatFullDate(faq.updated_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}