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

    const handleSave = async () => {
        if (!file_path.trim()) return alert("Please upload an image");

        setIsSaving(true);

        const now = new Date();
        const newGallery: Gallery = {
            id: `Gallery-${Date.now()}`,
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

        setIsSaving(false);
        setFilePath("");
        setCaption("");
        setAltText("");
        setIsPublished(false);
        onOpenChange(false);
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New Gallery Image</DialogTitle>
                    <DialogDescription>
                        Create a new entry for your gallery section.
                    </DialogDescription>
                </DialogHeader>
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
