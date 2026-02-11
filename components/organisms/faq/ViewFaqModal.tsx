"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Faq } from "@/constants/faqs";
import { Quote } from "lucide-react";

export function ViewFaqModal({
    open,
    onOpenChange,
    faq
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq: Faq | null
}) {
    if (!faq) return null;

    const formatFullDate = (date: any) => {
        if (!date) return "—";
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return "—";
            return d.toLocaleString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "long",
                year: "numeric"
            }) + " WIB";
        } catch (e) {
            return "—";
        }
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
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-black tracking-[0.2em] ml-0.5">
                                Question
                            </p>
                            <h3 className="text-base sm:text-lg font-bold text-arcipta-blue-primary leading-relaxed font-satoshi ml-0.5">
                                {faq.question}
                            </h3>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <Quote className="size-4 text-arcipta-blue-primary rotate-180" />
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    Answer
                                </p>
                            </div>

                            <div className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    "{faq.answer}"
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 pb-2 text-[11px]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-bold uppercase tracking-tighter">
                                        Created At
                                    </span>
                                </div>
                                <span className="font-medium text-black">
                                    {formatFullDate(faq.created_at)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-bold uppercase tracking-tighter">
                                        Last Update At
                                    </span>
                                </div>
                                <span className="font-medium text-black">
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
