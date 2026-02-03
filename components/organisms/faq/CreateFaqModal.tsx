"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addFaq } from "@/utils/faq-storage";
import { Loader2 } from "lucide-react";

interface CreateProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
    children?: React.ReactElement; 
}

export function CreateFaqModal({ open, onOpenChange, onSuccess, onError, children }: CreateProps) {
    const [form, setForm] = React.useState({ question: "", answer: "" });
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (open) setForm({ question: "", answer: "" });
    }, [open]);

    const handleSave = async () => {
        if (!form.question.trim()) return onError("Question is required");
        if (!form.answer.trim()) return onError("Answer is required");

        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 1000)); 
            const now = new Date();
            addFaq({
                id: Date.now(),
                question: form.question,
                answer: form.answer,
                created_at: now,
                updated_at: now,
            });
            onOpenChange(false);
            onSuccess();
        } catch {
            onError("Failed to save FAQ.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            
            <DialogContent className="sm:max-w-[525px]" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Add New FAQ</DialogTitle>
                    <DialogDescription>Create a new entry for your FAQ section.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                            id="question"
                            value={form.question}
                            onChange={e => setForm({ ...form, question: e.target.value })}
                            className="min-h-[60px]"
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                            id="answer"
                            value={form.answer}
                            onChange={e => setForm({ ...form, answer: e.target.value })}
                            className="min-h-[100px]"
                            disabled={isSaving}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary min-w-[140px]">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save FAQ"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}