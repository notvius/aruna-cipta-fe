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
import { addTestimonial } from "@/utils/testimonial-storage";
import { type Testimonial } from "@/constants/testimonials";
import { Loader2 } from "lucide-react";

interface CreateTestimonialModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateTestimonialModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateTestimonialModalProps) {
    const [clientName, setClientName] = React.useState("");
    const [clientTitle, setClientTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (open) {
            setError(null);
            setSuccess(null);
            setClientName("");
            setClientTitle("");
            setContent("");
        }
    }, [open]);

    React.useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [clientName, clientTitle, content]);

    const handleSave = async () => {
        if (!clientName.trim()) {
            setError("Client name is required");
            return;
        }
        if (!clientTitle.trim()) {
            setError("Client title is required");
            return;
        }
        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            const now = new Date();
            const newTestimonial: Testimonial = {
                id: Date.now(),
                client_name: clientName,
                client_title: clientTitle,
                content,
                created_at: now,
                updated_at: now,
            };

            addTestimonial(newTestimonial);

            await new Promise((resolve) => setTimeout(resolve, 800));4

            setSuccess("Testimonial added successfully!");

            setTimeout(() => {
                setClientName("");
                setClientTitle("");
                setContent("");
                onOpenChange(false);
                onSuccess();
            }, 1500);
            
        } catch (error) {
            setError("Failed to save testimonial. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New Testimonial</DialogTitle>
                    <DialogDescription>
                        Create a new entry for your testimonial section.
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
                        <Label htmlFor="client_name">Client Name</Label>
                        <Textarea
                            id="client_name"
                            placeholder="Type your client name here..."
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="min-h-[30px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="client_title">Client Title</Label>
                        <Textarea
                            id="client_title"
                            placeholder="Type the client title here..."
                            value={clientTitle}
                            onChange={(e) => setClientTitle(e.target.value)}
                            className="min-h-[30px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Type the content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[100px]"
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
