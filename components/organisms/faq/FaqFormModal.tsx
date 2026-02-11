"use client";

import * as React from "react";
import Cookies from "js-cookie";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { type Faq } from "@/constants/faqs";
import { cn } from "@/lib/utils";

interface FaqFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq?: Faq | null;
    onSuccess: (message: string) => void;
    onError: (msg: string) => void;
}

export function FaqFormModal({
    open,
    onOpenChange,
    faq,
    onSuccess,
    onError
}: FaqFormModalProps) {
    const [form, setForm] = React.useState({ question: "", answer: "" });
    const [isSaving, setIsSaving] = React.useState(false);
    const isEdit = !!faq;

    const focusStyles = "focus-visible:ring-1 focus-visible:ring-arcipta-blue-primary/40 focus-visible:border-arcipta-blue-primary/40 transition-all";

    React.useEffect(() => {
        if (open) {
            if (faq) {
                setForm({ question: faq.question, answer: faq.answer });
            } else {
                setForm({ question: "", answer: "" });
            }
        }
    }, [open, faq]);

    const handleSave = async () => {
        if (!form.question.trim() || !form.answer.trim()) {
            return onError("All fields are required");
        }

        setIsSaving(true);

        await new Promise(r => setTimeout(r, 1500));

        const token = Cookies.get("token");
        const url = isEdit
            ? `${process.env.NEXT_PUBLIC_API_URL}/faq/${faq?.uuid}`
            : `${process.env.NEXT_PUBLIC_API_URL}/faq`;

        try {
            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Operation failed");
            }

            onSuccess(isEdit ? "FAQ updated successfully!" : "New FAQ published!");
            onOpenChange(false);
        } catch (err: any) {
            onError(err.message || "An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl font-jakarta bg-white"
                onInteractOutside={e => e.preventDefault()}
            >
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-outfit uppercase tracking-tight text-slate-900">
                        {isEdit ? "Update FAQ" : "Add New FAQ"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground tracking-tight">
                        {isEdit
                            ? "Modify the existing question and answer"
                            : "Create a new frequently asked question"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            The Question
                        </Label>
                        <Textarea
                            placeholder="e.g., How do I track my project progress?"
                            value={form.question}
                            onChange={e => setForm({ ...form, question: e.target.value })}
                            className={cn(
                                "min-h-[80px] rounded-xl bg-slate-50/50 resize-none leading-relaxed border-slate-200",
                                focusStyles
                            )}
                            disabled={isSaving}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            The Answer
                        </Label>
                        <Textarea
                            placeholder="Provide a clear explanation..."
                            value={form.answer}
                            onChange={e => setForm({ ...form, answer: e.target.value })}
                            className={cn(
                                "min-h-[150px] rounded-xl bg-slate-50/50 resize-none leading-relaxed border-slate-200",
                                focusStyles
                            )}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 h-10 px-6 flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-slate-900 hover:opacity-90 text-white rounded-xl h-10 px-8 font-bold text-[10px] uppercase tracking-widest min-w-[120px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                {isEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                {isEdit ? "Update FAQ" : "Publish FAQ"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
