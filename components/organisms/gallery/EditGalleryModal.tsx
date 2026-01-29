"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { Pencil, Loader2 } from "lucide-react";
import { Gallery } from "@/constants/galleries";
import AlertError2 from "@/components/alert-error-2";
import AlertSuccess2 from "@/components/alert-success-2";

interface EditGalleryModalProps {
    gallery: Gallery;
    onSave: (updatedGallery: Gallery) => void;
}

export function EditGalleryModal({ gallery, onSave }: EditGalleryModalProps) {
    const [filePath, setFilePath] = React.useState(gallery.file_path);
    const [caption, setCaption] = React.useState(gallery.caption);
    const [altText, setAltText] = React.useState(gallery.alt_text);
    const [isSaving, setIsSaving] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open) {
            setError(null);
            setFilePath(gallery.file_path);
            setCaption(gallery.caption);
            setAltText(gallery.alt_text);
        }
    }, [open, gallery]);

    React.useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [filePath, caption, altText]);

    const handleSave = async () => {
        if (!filePath.trim()) {
            setError("Image is required");
            return;
        }
        if (!caption.trim()) {
            setError("Caption is required");
            return;
        }
        if (!altText.trim()) {
            setError("Alt text is required");
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            const updatedGallery: Gallery = {
                ...gallery,
                file_path: filePath,
                caption,
                alt_text: altText,
                updated_at: new Date(),
            };

            onSave(updatedGallery);

            await new Promise((r) => setTimeout(r, 800));

            setSuccess("Gallery updated successfully!");
            setIsSaving(false);

            setTimeout(() => {
                setSuccess(null);
                setOpen(false);
            }, 1500);
        } catch (error) {
            setError("Failed to update gallery. Please try again.");
            setIsSaving(false);
        }
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
                    <DialogTitle>Edit Gallery</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Image</Label>
                        <ImageUpload value={filePath} onChange={setFilePath} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Caption</Label>
                        <Textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="min-h-[50px]"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Alt Text</Label>
                        <Textarea
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            className="min-h-[50px]"
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
