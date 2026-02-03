"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Faq } from "@/constants/faqs";

interface EditProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq: Faq;
    onSave: (updateFaq: Faq) => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
}

export function EditFaqModal({ open, onOpenChange, faq, onSave, onSuccess, onError }: EditProps) {
    const [form, setForm] = React.useState({ question: "", answer: "" });
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setForm({ 
                question: faq.question, 
                answer: faq.answer 
            });
        }
    }, [open, faq]);

    const handleSave = async () => {
        if (!form.question.trim()) return onError("Question is required");
        if (!form.answer.trim()) return onError("Answer is required");
        
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 1000));
            
            onSave({ 
                ...faq, 
                question: form.question, 
                answer: form.answer, 
                updated_at: new Date() 
            });
            
            onOpenChange(false);
            onSuccess();
        } catch {
            onError("Failed to update FAQ.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-[550px]" 
                onInteractOutside={e => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Edit FAQ</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Question</Label>
                        <Textarea 
                            value={form.question} 
                            onChange={e => setForm({ ...form, question: e.target.value })} 
                            className="min-h-[60px]" 
                            disabled={isSaving} 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Answer</Label>
                        <Textarea 
                            value={form.answer} 
                            onChange={e => setForm({ ...form, answer: e.target.value })} 
                            className="min-h-[120px]" 
                            disabled={isSaving} 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-arcipta-blue-primary min-w-[120px]"
                    >
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}