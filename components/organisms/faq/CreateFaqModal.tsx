"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AlertError2 from "@/components/alert-error-2";
import AlertSuccess2 from "@/components/alert-success-2";
import { addFaq } from "@/utils/faq-storage";
import { type Faq } from "@/constants/faqs";
import { Loader2 } from "lucide-react";

interface CreateFaqModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateFaqModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateFaqModalProps) {
    const [question, setQuestion] = React.useState("");
    const [answer, setAnswer] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const handleSave = async () => {
        if (!question.trim()) {
            setError("Please enter a question");
            return;
        }
        if (!answer.trim()) {
            setError("Please enter an answer");
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            const now = new Date();
            const newFaq: Faq = {
                id: Date.now(),
                question,
                answer,
                created_at: now,
                updated_at: now,
            };

            addFaq(newFaq);

            await new Promise((resolve) => setTimeout(resolve, 800));

            setSuccess("FAQ added successfully!");

            setTimeout(() => {
                setQuestion("");
                setAnswer("");
                onOpenChange(false);
                onSuccess();
            }, 1200);
            
        } catch (error) {
            setError("Failed to save FAQ. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New FAQ</DialogTitle>
                    <DialogDescription>
                        Create a new entry for your FAQ section.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <AlertError2 message={error} />
                )}

                {success && (
                    <AlertSuccess2 message={success} />
                )}

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                            id="question"
                            placeholder="Type your question here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="min-h-[30px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                            id="answer"
                            placeholder="Type the answer here..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="min-h-[30px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Testimonial"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
