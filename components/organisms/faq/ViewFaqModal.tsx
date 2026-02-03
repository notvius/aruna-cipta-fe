"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Faq } from "@/constants/faqs";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq: Faq;
}

export function ViewFaqModal({ open, onOpenChange, faq }: ViewProps) {
    const format = (d: Date | string | null | undefined) => {
        if (!d) return "—";
        const date = d instanceof Date ? d : new Date(d);
        return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString("id-ID", {
            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
        });
    };

    const Field = ({ label, value, full }: { label: string; value: string; full?: boolean }) => (
        <div className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
            <div className={full ? "text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg border" : "text-sm text-foreground"}>
                {value || <span className="italic text-muted-foreground">No data</span>}
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">FAQ Details</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-6 py-4">
                    <div className="col-span-2 space-y-6 pt-2 border-t">
                        <Field label="Question" value={faq.question} full />
                        <Field label="Answer" value={faq.answer} full />
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-4 pt-2 border-t">
                        <Field label="Created At" value={format(faq.created_at)} />
                        <Field label="Updated At" value={format(faq.updated_at)} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}