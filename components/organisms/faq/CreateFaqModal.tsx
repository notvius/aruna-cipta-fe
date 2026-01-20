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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

    const handleSave = async () => {
        if (!question.trim()) return alert("Please enter a question");
        if (!answer.trim()) return alert("Please enter an answer");

        setIsSaving(true);

        const now = new Date().toISOString();
        const newFaq: Faq = {
            id: `FAQ-${Date.now()}`,
            question,
            answer,
            status: "Unpublished",
            createdAt: now,
            updatedAt: now,
        };

        addFaq(newFaq);

        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsSaving(false);
        setQuestion("");
        setAnswer("");
        onOpenChange(false);
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New FAQ</DialogTitle>
                    <DialogDescription>
                        Create a new question and answer for your FAQ section.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                            id="question"
                            placeholder="Type your question here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                            id="answer"
                            placeholder="Type the answer here..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="min-h-[150px]"
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
                            "Save FAQ"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
