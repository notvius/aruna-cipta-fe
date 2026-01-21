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
import { Pencil } from "lucide-react";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";

interface EditGalleryModalProps {
    initialContent: string;
    onSave: (newContent: string) => void;
    title?: string;
    type?: "text" | "image";
}

export function EditGalleryModal({
    initialContent,
    onSave,
    title = "Edit Content",
    type = "text",
}: EditGalleryModalProps) {
    const [content, setContent] = React.useState(initialContent);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleSave = () => {
        onSave(content);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Modify the {type === "image" ? "image" : "content"} of this gallery below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {type === "image" ? (
                        <ImageUpload
                            value={content}
                            onChange={setContent}
                        />
                    ) : (
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px] resize-none"
                        />
                    )}
                </div>
                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90"
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
