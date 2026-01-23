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
import { Service } from "@/constants/services";
import { Editor } from "@tinymce/tinymce-react";

interface EditServiceModalProps {
    service: Service;
    onSave: (updatedService: Service) => void;
}

export function EditServiceModal({ service, onSave }: EditServiceModalProps) {
    const [title, setTitle] = React.useState(service.title);
    const [content, setContent] = React.useState(service.content);
    const [featured_image, setFeaturedImage] = React.useState(service.featured_image);
    const [isSaving, setIsSaving] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleSave = async () => {
        setIsSaving(true);

        const updatedService: Service = {
            ...service,
            title,
            content,
            featured_image,
            updated_at: new Date(),
        };

        onSave(updatedService);

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

            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Edit Service</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 pt-4">

                    <div className="space-y-4">
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

                    <div className="space-y-6">
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
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
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
                        