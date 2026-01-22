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

    const handleSave = async () => {
        setIsSaving(true);

        const updatedFaq: Faq = {
            ...faq,
            question,
            answer,
            updated_at: new Date(),
        };

        onSave(updatedFaq);

        await new Promise((r) => setTimeout(r, 500));

        setIsSaving(false);
        setOpen(false);
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