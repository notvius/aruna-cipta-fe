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
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { addGallery } from "@/utils/gallery-storage";
import { type Gallery } from "@/constants/galleries";
import { Loader2 } from "lucide-react";

interface CreateGalleryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateGalleryModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateGalleryModalProps) {
    const [file_path, setFilePath] = React.useState("");
    const [caption, setCaption] = React.useState("");
    const [alt_text, setAltText] = React.useState("");
    const [is_published, setIsPublished] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open) {
            setError(null);
            setSuccess(null);
            setFilePath("");
            setCaption("");
            setAltText("");
            setIsPublished(false);
        }
    }, [open]);

    React.useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [file_path, caption, alt_text, is_published]);

    const handleSave = async () => {
        if (!file_path.trim()) {
            setError("Image is required");
            return;
        }
        if (!caption.trim()) {
            setError("Caption is required");
            return;
        }
        if (!alt_text.trim()) {
            setError("Alt text is required");
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            const now = new Date();
            const newGallery: Gallery = {
                id: Date.now(),
                file_path,
                caption,
                alt_text,
                is_published,
                created_at: now,
                updated_at: now,
                deleted_at: null,
            };

            addGallery(newGallery);

            await new Promise((resolve) => setTimeout(resolve, 800));

            setSuccess("Gallery added successfully!");

            setTimeout(() => {
                setFilePath("");
                setCaption("");
                setAltText("");
                setIsPublished(false);
                onOpenChange(false);
                onSuccess();  
            }, 1200);

        } catch (error) {
            setError("Failed to save gallery. Please try again.");
            setIsSaving(false);
        }
    }   

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New Gallery Image</DialogTitle>
                    <DialogDescription>
                        Create a new entry for your gallery section.
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
                        <Label>Image</Label>
                        <ImageUpload
                            value={file_path}
                            onChange={setFilePath}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Textarea
                            id="caption"
                            placeholder="Type the caption here..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="min-h-[50px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="alt_text">Alt Text</Label>
                        <Textarea
                            id="alt_text"
                            placeholder="Type the alt text here..."
                            value={alt_text}
                            onChange={(e) => setAltText(e.target.value)}
                            className="min-h-[50px]"
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
                            "Save Gallery"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
