"use client";

import * as React from "react";
import { Editor } from "@tinymce/tinymce-react";
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
import { addService } from "@/utils/service-storage";
import { type Service } from "@/constants/services";
import { Loader2 } from "lucide-react";

interface CreateServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateServiceModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateServiceModalProps) {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [featured_image, setFeaturedImage] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open) {
            setError(null);
            setSuccess(null);
            setTitle("");
            setContent("");
            setFeaturedImage("");
        }
    }, [open]);

    React.useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [title, content, featured_image]);

    const handleSave = async () => {
        if (!featured_image.trim()) {
            setError("Image is required");
            return;
        }
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            const now = new Date();
            const newService: Service = {
                id: Date.now(),
                featured_image,
                title,
                content,
                created_at: now,
                updated_at: now,
            };

            addService(newService);

            await new Promise((resolve) => setTimeout(resolve, 800));

            setSuccess("Service added successfully!");

            setTimeout(() => {
                setFeaturedImage("");
                setTitle("");
                setContent("");
                onOpenChange(false);
                onSuccess();
            }, 1500);

        } catch (error) {
            setError("Failed to save service. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                    <DialogDescription>
                        Create a new entry for your service section.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <AlertError2 message={error} />
                )}

                {success && (
                    <AlertSuccess2 message={success} />
                )}

                <div className="grid grid-cols-2 gap-6 pt-4">

                    {/* Title */}
                    <div className="space-y-4]">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Textarea
                                id="title"
                                placeholder="Type the title here..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Gambar */}
                    <div className="space-y-6 ma">
                        <div className="flex flex-col gap-2">
                            <Label>Image</Label>
                            <ImageUpload
                                value={featured_image}
                                onChange={setFeaturedImage}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 max-h-[300px]">
                    <Label htmlFor="content">Content</Label>
                    <Editor
                        apiKey="k7l6wxymdavx8maeydx2yo2w2pvaw8oo2b9ados6cp1ju2k8"
                        init={{
                            menubar: false,
                            plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    skin: "oxide",
                                    content_css: "default"
                                }}
                                value={content}
                                onEditorChange={(newContent) => setContent(newContent)}
                            />
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
                            "Save Service"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
