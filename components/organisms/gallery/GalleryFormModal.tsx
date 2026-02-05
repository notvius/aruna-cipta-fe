"use client";

import * as React from "react";
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
import { addGallery, updateGallery } from "@/utils/gallery-storage";
import { Loader2, ImageIcon, Type, AlignLeft, Save, PlusCircle } from "lucide-react";
import { type Gallery } from "@/constants/galleries";
import { cn } from "@/lib/utils";

interface GalleryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gallery?: Gallery | null;
    onSave?: (updated: Gallery) => void;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export function GalleryFormModal({
    open,
    onOpenChange,
    gallery,
    onSave,
    onSuccess,
    onError,
}: GalleryFormModalProps) {
    const [form, setForm] = React.useState({ file_path: "", caption: "", alt_text: "" });
    const [isSaving, setIsSaving] = React.useState(false);

    const isEdit = !!gallery;

    React.useEffect(() => {
        if (open) {
            if (gallery) {
                setForm({
                    file_path: gallery.file_path,
                    caption: gallery.caption,
                    alt_text: gallery.alt_text,
                });
            } else {
                setForm({ file_path: "", caption: "", alt_text: "" });
            }
        }
    }, [open, gallery]);

    const handleSave = async () => {
        if (!form.file_path.trim()) return onError("Image asset is required");
        if (!form.caption.trim()) return onError("Caption is required");

        setIsSaving(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            const now = new Date();

            if (isEdit && gallery) {
                const updatedData: Gallery = {
                    ...gallery,
                    ...form,
                    updated_at: now,
                };
                updateGallery(updatedData);
                if (onSave) onSave(updatedData);
                onSuccess("Gallery asset updated successfully!");
            } else {
                const newData: Gallery = {
                    id: Date.now(),
                    ...form,
                    is_published: false,
                    created_at: now,
                    updated_at: now,
                    deleted_at: null,
                };
                addGallery(newData);
                onSuccess("New image added to gallery!");
            }
            onOpenChange(false);
        } catch (err) {
            onError("An error occurred while saving the gallery asset.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputFocus = "focus-visible:ring-2 focus-visible:ring-arcipta-blue-primary/20 focus-visible:border-arcipta-blue-primary transition-all duration-300";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl font-satoshi" 
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        {isEdit ? "Update Media Asset" : "Upload New Gallery "}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground tracking-tight">
                        {isEdit ? "Modify image metadata and details" : "Add a new visual asset to your gallery library"}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Image Upload Section */}
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Visual Asset
                            </Label>
                        </div>
                        <ImageUpload 
                            value={form.file_path} 
                            onChange={(val) => setForm({ ...form, file_path: val })} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Caption Input */}
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Label htmlFor="caption" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Caption
                                </Label>
                            </div>
                            <Textarea
                                id="caption"
                                placeholder="Short description..."
                                value={form.caption}
                                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                                className={cn("min-h-[100px] rounded-2xl bg-slate-50/50 resize-none leading-relaxed px-4 py-3", inputFocus)}
                                disabled={isSaving}
                            />
                        </div>

                        {/* Alt Text Input */}
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Label htmlFor="alt_text" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Alt Text (SEO)
                                </Label>
                            </div>
                            <Textarea
                                id="alt_text"
                                placeholder="Describe the image for accessibility..."
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
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-100 h-10 px-6 flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-arcipta-blue-primary hover:opacity-90 text-white rounded-xl h-10 px-8 shadow-sm font-bold text-[10px] uppercase tracking-widest min-w-[180px] flex-1 sm:flex-none"
                    >
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> processing...</>
                        ) : (
                            <>{isEdit ? <Save className="mr-1 h-3 w-3" /> : <PlusCircle className="mr-2 h-3 w-3" />} {isEdit ? "Update Asset" : "Upload Asset"}</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}