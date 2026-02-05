"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Testimonial } from "@/constants/testimonials";
import { Quote, Calendar, UserCircle } from "lucide-react";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial: Testimonial;
}

export function ViewTestimonialModal({ open, onOpenChange, testimonial }: ViewProps) {
    if (!testimonial) return null;

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
                        Testimonial Details
                    </DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[80vh] w-full">
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-arcipta-blue-primary/10 flex items-center justify-center border border-arcipta-blue-primary/20 shrink-0">
                                    <span className="text-arcipta-blue-primary font-bold font-orbitron text-lg">
                                        {testimonial.client_name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="space-y-0.5 overflow-hidden">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Client Name</p>
                                    <p className="font-bold text-slate-900 truncate">{testimonial.client_name}</p>
                                </div>
                            </div>
                            <div className="space-y-1 text-right self-center">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Position / Title</p>
                                <p className="font-bold text-slate-900 text-sm truncate">{testimonial.client_title}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <Quote className="size-4 text-arcipta-blue-primary rotate-180" />
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Client Feedback Statement</p>
                            </div>
                            
                            <div className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    "{testimonial.content}"
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 pb-2 text-[11px]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-bold uppercase tracking-tighter">Created At</span>
                                </div>
                                <span className="font-medium text-black">
                                    {formatFullDate(testimonial.created_at)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground font-bold uppercase tracking-tighter">Last Update At</span>
                                </div>
                                <span className="font-medium text-black">
                                    {formatFullDate(testimonial.updated_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}