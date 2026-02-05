"use client";

import * as React from "react";
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
import { addFaq, updateFaq } from "@/utils/faq-storage";
import { Loader2, HelpCircle, FileText, Save, PlusCircle } from "lucide-react";
import { type Faq } from "@/constants/faqs";
import { cn } from "@/lib/utils";

interface FaqFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq?: Faq | null; 
    onSave?: (updatedFaq: Faq) => void;
    onSuccess: (message: string) => void;
    onError: (msg: string) => void;
}

export function FaqFormModal({ 
    open, 
    onOpenChange, 
    faq, 
    onSave, 
    onSuccess, 
    onError 
}: FaqFormModalProps) {
    const [form, setForm] = React.useState({ question: "", answer: "" });
    const [isSaving, setIsSaving] = React.useState(false);

    const isEdit = !!faq;

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
        if (!form.question.trim()) return onError("Question is required");
        if (!form.answer.trim()) return onError("Answer is required");

        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 800)); 
            const now = new Date();

            if (isEdit && faq) {
                const updatedData: Faq = {
                    ...faq,
                    question: form.question,
                    answer: form.answer,
                    updated_at: now,
                };
                updateFaq(updatedData);
                if (onSave) onSave(updatedData);
                onSuccess("FAQ record updated successfully!");
            } else {
                const newData: Faq = {
                    id: Date.now(),
                    question: form.question,
                    answer: form.answer,
                    created_at: now,
                    updated_at: now,
                };
                addFaq(newData);
                onSuccess("New FAQ added successfully!");
            }
            onOpenChange(false);
        } catch (err) {
            onError("An error occurred while saving the FAQ.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputFocus = "focus-visible:ring-2 focus-visible:ring-arcipta-blue-primary/20 focus-visible:border-arcipta-blue-primary transition-all duration-300";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl font-satoshi" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        {isEdit ? "Update FAQ" : "Create New FAQ"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground tracking-tight">
                        {isEdit ? "Modify existing information" : "Add information for frequently asked questions"}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Question Input */}
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Label htmlFor="question" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                The Question
                            </Label>
                        </div>
                        <Textarea
                            id="question"
                            placeholder="e.g., How do I track my project progress?"
                            value={form.question}
                            onChange={e => setForm({ ...form, question: e.target.value })}
                            className={cn("min-h-[80px] rounded-xl bg-slate-50/50 resize-none leading-relaxed", inputFocus)}
                            disabled={isSaving}
                        />
                    </div>

                    {/* Answer Input */}
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Label htmlFor="answer" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                The Answer
                            </Label>
                        </div>
                        <Textarea
                            id="answer"
                            placeholder="Provide a clear explanation..."
                            value={form.answer}
                            onChange={e => setForm({ ...form, answer: e.target.value })}
                            className={cn("min-h-[150px] rounded-xl bg-slate-50/50 resize-none leading-relaxed", inputFocus)}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 flex gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isSaving}
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-100 h-10 px-6 flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-arcipta-blue-primary hover:opacity-90 text-white rounded-xl h-10 px-8 shadow-sm font-bold text-[10px] uppercase tracking-widest min-w-[160px] flex-1 sm:flex-none"
                    >
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> saving...</>
                        ) : (
                            <>{isEdit ? <Save className="mr-2 h-3 w-3" /> : <PlusCircle className="mr-1 h-3 w-3" />} {isEdit ? "Update FAQ" : "Publish FAQ"}</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}