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
    const [status, setStatus] = React.useState("Unpublished");
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSave = async () => {
        if (!clientName.trim()) return alert("Please enter a client name");
        if (!clientTitle.trim()) return alert("Please enter a client title");
        if (!content.trim()) return alert("Please enter a content");

        setIsSaving(true);

        const now = new Date().toISOString();
        const newTestimonial: Testimonial = {
            id: `Testimonial-${Date.now()}`,
            clientName,
            clientTitle,
            content,
            status: "Unpublished",
            createdAt: now,
            updatedAt: now,
        };

        addTestimonial(newTestimonial);

        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsSaving(false);
        setClientName("");
        setClientTitle("");
        setContent("");
        setStatus("Unpublished");
        onOpenChange(false);
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New Testimonial</DialogTitle>
                    <DialogDescription>
                        Create a new Testimonial.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">Client Name</Label>
                        <Textarea
                            id="clientName"
                            placeholder="Type your client name here..."
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="answer">Client Title</Label>
                        <Textarea
                            id="clientTitle"
                            placeholder="Type the client title here..."
                            value={clientTitle}
                            onChange={(e) => setClientTitle(e.target.value)}
                            className="min-h-[150px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Type the content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
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
                            "Save Testimonial"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
