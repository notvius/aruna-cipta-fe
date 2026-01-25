"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ArticleCategory } from "@/constants/article_category";

interface EditModalProps {
    articleCategory: ArticleCategory;
    onSave: (updateArticleCategory: ArticleCategory) => void;
}

export function EditArticleCategoryModal({ articleCategory, onSave }: EditModalProps) {
    const [name, setName] = React.useState(articleCategory.name);
    const [isSaving, setIsSaving] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleSave = async () => {
        setIsSaving(true);

        const updatedArticleCategory: ArticleCategory = {
            ...articleCategory,
            name,
            updated_at: new Date(),
        };

        onSave(updatedArticleCategory);

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
                    <DialogTitle>Edit Article Category</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Textarea
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="min-h-[30px]"
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