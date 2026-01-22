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
import { Testimonial } from "@/constants/testimonials";

interface EditTestimonialModalProps {
    testimonial: Testimonial;
    onSave: (updateTestimonial: Testimonial) => void;
}

export function EditTestimonialModal({ testimonial, onSave }: EditTestimonialModalProps) {
    const [clientName, setClientName] = React.useState(testimonial.client_name);
    const [clientTitle, setClientTitle] = React.useState(testimonial.client_title);
    const [content, setContent] = React.useState(testimonial.content);
    const [isSaving, setIsSaving] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleSave = async () => {
        setIsSaving(true);

        const updatedTestimonial: Testimonial = {
            ...testimonial,
            client_name: clientName,
            client_title: clientTitle,
            content,
            updated_at: new Date(),
        };

        onSave(updatedTestimonial);

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
                    <DialogTitle>Edit Testimonial</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Client Name</Label>
                        <Textarea
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="min-h-[30px]"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Client Title</Label>
                        <Textarea
                            value={clientTitle}
                            onChange={(e) => setClientTitle(e.target.value)}
                            className="min-h-[30px]"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Content</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
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
