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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    const [icon, setIcon] = React.useState("");
    const [featured_image, setFeaturedImage] = React.useState("");
    const [status, setStatus] = React.useState("Published");
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSave = async () => {
        if (!title.trim()) return alert("Please enter a title");

        setIsSaving(true);

        const now = new Date().toISOString();
        const newService: Service = {
            id: `Service-${Date.now()}`,
            title,
            content,
            icon,
            featured_image,
            status,
            createdAt: now,
            updatedAt: now,
        };

        addService(newService);

        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsSaving(false);
        setTitle("");
        setContent("");
        setIcon("");
        setFeaturedImage("");
        setStatus("Published");
        onOpenChange(false);
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                    <DialogDescription>
                        Create a new entry for your service section.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Service title (e.g., Web Development)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="icon">Icon Name</Label>
                            <Input
                                id="icon"
                                placeholder="Lucide icon name (e.g., Code, Smartphone)"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Featured Image</Label>
                            <ImageUpload
                                value={featured_image}
                                onChange={setFeaturedImage}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Describe the service in detail..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[260px] resize-none"
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
                            "Save Service"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
