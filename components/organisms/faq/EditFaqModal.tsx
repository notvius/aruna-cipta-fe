"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import AlertError2 from "@/components/alert-error-2";
import AlertSuccess2 from "@/components/alert-success-2";
import { Faq } from "@/constants/faqs";

interface EditModalProps {
    faq: Faq;
    onSave: (updateFaq: Faq) => void;
}

export function EditFaqModal({ faq, onSave }: EditModalProps) {
    const [question, setQuestion] = React.useState(faq.question);
    const [answer, setAnswer] = React.useState(faq.answer);
    const [isSaving, setIsSaving] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open) {
            setError(null);
            setQuestion(faq.question);
            setAnswer(faq.answer);
        }
    }, [open, faq]);

    React.useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [question, answer]);

    const handleSave = async () => {
        if (!question.trim()) return setError("Question is required");
        if (!answer.trim()) return setError("Answer is required");

        setError(null);
        setIsSaving(true);

        try {
            const updatedFaq: Faq = {
            ...faq,
            question,
            answer,
            updated_at: new Date(),
        };

        onSave(updatedFaq);

        await new Promise((r) => setTimeout(r, 800));

        setSuccess("FAQ updated successfully!");
        setIsSaving(false);

        setTimeout(() => {
            setSuccess(null);
            setOpen(false);
        }, 1500);
        } catch (error) {
            setError("Failed to update FAQ. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-arcipta-blue-primary"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Edit FAQ</DialogTitle>
                </DialogHeader>

                {error && (
                    <AlertError2 message={error} onClose={() => setError(null)} />
                )}

                {success && (
                    <AlertSuccess2 message={success} />
                )}

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Question</Label>
                        <Textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="min-h-[30px]"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Answer</Label>
                        <Textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-arcipta-blue-primary"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}