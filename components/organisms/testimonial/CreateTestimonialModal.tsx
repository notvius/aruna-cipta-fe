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
import { addTestimonial } from "@/utils/testimonial-storage";
import { Loader2 } from "lucide-react";

interface CreateProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
    children: React.ReactElement;
}

export function CreateTestimonialModal({ open, onOpenChange, onSuccess, onError, children }: CreateProps) {
    const [form, setForm] = React.useState({ name: "", title: "", content: "" });
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (open) setForm({ name: "", title: "", content: "" });
    }, [open]);

    const handleSave = async () => {
        if (!form.name.trim()) return onError("Client name is required");
        if (!form.title.trim()) return onError("Client title is required");
        if (!form.content.trim()) return onError("Content is required");

        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 1000));
            const now = new Date();
            addTestimonial({
                id: Date.now(),
                client_name: form.name,
                client_title: form.title,
                content: form.content,
                created_at: now,
                updated_at: now,
            });
            onOpenChange(false);
            onSuccess();
        } catch {
            onError("Failed to save testimonial.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[525px]" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Add New Testimonial</DialogTitle>
                    <DialogDescription>Create a new entry for your testimonial section.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Client Name</Label>
                        <Textarea
                            id="name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="min-h-[30px]"
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Client Title</Label>
                        <Textarea
                            id="title"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="min-h-[30px]"
                            disabled={isSaving}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            className="min-h-[100px]"
                            disabled={isSaving}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary min-w-[140px]">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Testimonial"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}