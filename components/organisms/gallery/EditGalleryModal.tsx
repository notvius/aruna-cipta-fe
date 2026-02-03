"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { Loader2 } from "lucide-react";
import { Gallery } from "@/constants/galleries";

interface EditProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gallery: Gallery;
    onSave: (updated: Gallery) => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
}

export function EditGalleryModal({ open, onOpenChange, gallery, onSave, onSuccess, onError }: EditProps) {
    const [form, setForm] = React.useState({ file_path: "", caption: "", alt_text: "" });
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (open) setForm({ file_path: gallery.file_path, caption: gallery.caption, alt_text: gallery.alt_text });
    }, [open, gallery]);

    const handleSave = async () => {
        if (!form.file_path.trim() || !form.caption.trim()) return onError("All fields are required");
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 1000));
            onSave({ ...gallery, ...form, updated_at: new Date() });
            onOpenChange(false);
            onSuccess();
        } catch {
            onError("Failed to update gallery.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader><DialogTitle>Edit Gallery</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Image</Label>
                        <ImageUpload value={form.file_path} onChange={val => setForm({...form, file_path: val})} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Caption</Label>
                        <Textarea value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} className="min-h-[60px]" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Alt Text</Label>
                        <Textarea value={form.alt_text} onChange={e => setForm({...form, alt_text: e.target.value})} className="min-h-[60px]" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary min-w-[120px]">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}