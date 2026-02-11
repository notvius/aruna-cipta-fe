"use client";

import * as React from "react";
import Cookies from "js-cookie";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { type Gallery } from "@/constants/galleries";
import { cn } from "@/lib/utils";

interface GalleryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gallery?: Gallery | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export function GalleryFormModal({
    open,
    onOpenChange,
    gallery,
    onSuccess,
    onError,
}: GalleryFormModalProps) {
    const [form, setForm] = React.useState<{
        caption: string;
        alt_text: string;
        file: File | null;
        preview: string;
    }>({ 
        caption: "", 
        alt_text: "", 
        file: null, 
        preview: "" 
    });
    const [isSaving, setIsSaving] = React.useState(false);
    const isEdit = !!gallery;

    React.useEffect(() => {
        if (open) {
            if (gallery) {
                setForm({
                    caption: gallery.caption,
                    alt_text: gallery.alt_text,
                    file: null,
                    preview: gallery.image_url,
                });
            } else {
                setForm({ caption: "", alt_text: "", file: null, preview: "" });
            }
        }
    }, [open, gallery]);

    const handleSave = async () => {
        if (!form.preview) return onError("Image asset is required");
        if (!form.caption.trim()) return onError("Caption is required");

        setIsSaving(true);

        const token = Cookies.get("token");
        const formData = new FormData();
        formData.append("caption", form.caption);
        formData.append("alt_text", form.alt_text);
        
        if (form.file) {
            formData.append("file_path", form.file);
        }

        let url = `${process.env.NEXT_PUBLIC_API_URL}/gallery`;

        if (isEdit && gallery) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/gallery/${gallery.uuid}`;
            formData.append("_method", "PUT");
        }

        try {
            const response = await fetch(url, {
                method: "POST", 
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to save asset");

            onSuccess(isEdit ? "Gallery asset updated successfully!" : "New image added to gallery!");
            onOpenChange(false);
        } catch (err: any) {
            onError(err.message || "Error saving data");
        } finally {
            setIsSaving(false);
        }
    };

    const inputFocus = "focus-visible:ring-2 focus-visible:ring-arcipta-blue-primary/20 focus-visible:border-arcipta-blue-primary transition-all duration-300";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl font-jakarta bg-white" 
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-outfit uppercase tracking-tight text-slate-900">
                        {isEdit ? "Update Media Asset" : "Upload New Gallery "}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground tracking-tight">
                        {isEdit ? "Modify image metadata and details" : "Add a new visual asset to your gallery library"}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Visual Asset
                        </Label>
                        <ImageUpload 
                            value={form.preview} 
                            onChange={(val, file) => setForm({ ...form, preview: val, file: file || null })} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="caption" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Caption
                            </Label>
                            <Textarea
                                id="caption"
                                placeholder="Short description..."
                                value={form.caption}
                                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                                className={cn("min-h-[100px] rounded-2xl bg-slate-50/50 resize-none leading-relaxed px-4 py-3", inputFocus)}
                                disabled={isSaving}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alt_text" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Alt Text (SEO)
                            </Label>
                            <Textarea
                                id="alt_text"
                                placeholder="Describe for accessibility..."
                                value={form.alt_text}
                                onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                                className={cn("min-h-[100px] rounded-2xl bg-slate-50/50 resize-none leading-relaxed px-4 py-3", inputFocus)}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 h-10 px-6 flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-slate-900 text-white rounded-xl h-10 px-8 font-bold text-[10px] uppercase tracking-widest min-w-[120px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                {isEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                {isEdit ? "Update Gallery" : "Publish Gallery"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}