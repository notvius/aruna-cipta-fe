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

    const handleSave = async () => {
        setIsSaving(true);

        const updatedGallery: Gallery = {
            ...gallery,
            file_path: filePath,
            caption,
            alt_text: altText,
            updatedAt: new Date(),
        };

        onSave(updatedGallery);

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
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Alt Text</Label>
                        <Textarea
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
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
