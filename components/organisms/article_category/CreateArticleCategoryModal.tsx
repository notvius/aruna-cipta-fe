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
import { addArticleCategory } from "@/utils/article-category-storage";
import { type ArticleCategory } from "@/constants/article_category";
import { Loader2 } from "lucide-react";

interface CreateArticleCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateArticleCategoryModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateArticleCategoryModalProps) {
    const [name, setName] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open) {
            setError(null);
            setSuccess(null);
            setName("");
        }
    }, [open]);

    React.useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [name]);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Please enter a name");
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            const now = new Date();
            const newArticleCategory: ArticleCategory = {
                id: Date.now(),
                name,
                article_id: [],
                created_at: now,
                updated_at: now,
            };

            addArticleCategory(newArticleCategory);

            await new Promise((resolve) => setTimeout(resolve, 800));

            setSuccess("Article category added successfully!");

            setTimeout(() => {
                setSuccess(null);
                setName("");
                onOpenChange(false);
                onSuccess();
            }, 1500);

        } catch (error) {
            setError("Failed to save article category. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New Article Category</DialogTitle>
                    <DialogDescription>
                        Create a new entry for your Article Category section.
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
                        <Label htmlFor="name">Name</Label>
                        <Textarea
                            id="name"
                            placeholder="Type your name here..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="min-h-[30px]"
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
                            "Save Article Category"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
