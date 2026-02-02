"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Testimonial } from "@/constants/testimonials";

interface EditProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial: Testimonial;
    onSave: (t: Testimonial) => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
}

export function EditTestimonialModal({ open, onOpenChange, testimonial, onSave, onSuccess, onError }: EditProps) {
    const [form, setForm] = React.useState({ name: "", title: "", content: "" });
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (open) setForm({ name: testimonial.client_name, title: testimonial.client_title, content: testimonial.content });
    }, [open, testimonial]);

    const handleSave = async () => {
        if (!form.name.trim()) return onError("Client name is required");
        if (!form.title.trim()) return onError("Client title is required");
        if (!form.content.trim()) return onError("Content is required");

        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 1000));
            onSave({ ...testimonial, client_name: form.name, client_title: form.title, content: form.content, updated_at: new Date() });
            onOpenChange(false);
            onSuccess();
        } catch {
            onError("Failed to update testimonial.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader><DialogTitle>Edit Testimonial</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Client Name</Label>
                        <Textarea value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="min-h-[30px]" disabled={isSaving} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Client Title</Label>
                        <Textarea value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="min-h-[30px]" disabled={isSaving} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Content</Label>
                        <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="min-h-[100px]" disabled={isSaving} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary min-w-[120px]">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}