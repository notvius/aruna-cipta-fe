"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Settings } from "lucide-react";
import AlertError2 from "@/components/alert-error-2"; 
import AlertSuccess2 from "@/components/alert-success-2";
import { ArticleEditor } from "@/components/molecules/article/ArticleEditor";
import { ArticleSidebar } from "@/components/molecules/article/ArticleSidebar";
import { addArticle, updateArticle } from "@/utils/article-storage";
import { Article } from "@/constants/articles";
import { ArticleCategory } from "@/constants/article_category";
import { getArticleCategories } from "@/utils/article-category-storage";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface ArticleFormProps {
    mode: "create" | "edit";
    initialData?: Article;
}

export function ArticleForm({ mode, initialData }: ArticleFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = React.useState(false);

    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    // Form State
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [category, setCategory] = React.useState<number | undefined>(undefined);
    const [is_published, setIsPublished] = React.useState(false);
    const [thumbnail, setThumbnail] = React.useState("");
    const [categories, setCategories] = React.useState<ArticleCategory[]>([]);

    React.useEffect(() => {
        setCategories(getArticleCategories());
        
        if (mode === "edit" && initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setCategory(initialData.category?.[0] ? Number(initialData.category[0]) : undefined);
            setIsPublished(initialData.is_published);
            setThumbnail(initialData.thumbnail);
        }
    }, [initialData, mode]);

    React.useEffect(() => {
        if (error) setError(null);
    }, [title, content, category, thumbnail]);

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    const handleSave = async () => {
        if (!title.trim() || title === "<h1>&nbsp;</h1>" || title === "<h1></h1>") {
            return setError("Title is required.");
        }
        if (!content.trim() || content === "<p>&nbsp;</p>") {
            return setError("Content cannot be empty.");
        }
        if (!category) {
            return setError("Category is required.");
        }
        if (!thumbnail) {
            return setError("Thumbnail is required.");
        }

        setError(null);
        setIsSaving(true);

        try {
            const now = new Date();
            let articlePayload: Article;

            if (mode === "create") {
                articlePayload = {
                    id: Date.now(),
                    title,
                    content,
                    category: [Number(category)],
                    is_published,
                    thumbnail,
                    created_at: now,
                    published_at: is_published ? now : null,
                    updated_at: now,
                    view_count: 0,
                    deleted_at: null,
                };
                addArticle(articlePayload);
            } else {
                if (!initialData) {
                    setError("Initial data missing. Cannot update.");
                    setIsSaving(false);
                    return;
                }

                articlePayload = {
                    ...initialData,
                    title,
                    content,
                    category: [Number(category)],
                    is_published,
                    thumbnail,
                    updated_at: now,
                    published_at: is_published && !initialData.is_published ? now : initialData.published_at,
                };
                updateArticle(articlePayload);
            }

            await new Promise((resolve) => setTimeout(resolve, 800));
            setSuccess("Article saved successfully.");

            setTimeout(() => {
                setIsSaving(false);
                router.push("/article");
            }, 1500);
    
        } catch (error) {
            setError("Failed to save article. Please try again.");
            setIsSaving(false);
        }

    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <header className="h-16 border-b flex items-center justify-between px-4 shrink-0 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="size-5" />
                    </Button>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">
                            {mode === "create" ? "Create New Article" : "Edit Article"}
                        </span>
                        <span className="text-xs text-muted-foreground hidden sm:block">
                            {mode === "create" ? "Draft saved locally" : "Changes saved locally"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="xl:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Settings className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-0 border-none">
                                <SheetHeader className="p-4 border-b">
                                    <SheetTitle>Article Settings</SheetTitle>
                                </SheetHeader>
                                <ArticleSidebar
                                    category={category}
                                    setCategory={setCategory}
                                    isPublished={is_published}
                                    setIsPublished={setIsPublished}
                                    thumbnail={thumbnail}
                                    setThumbnail={setThumbnail}
                                    wordCount={wordCount}
                                    categories={categories}
                                    className="w-full flex flex-col h-full overflow-y-auto p-4 gap-1"
                                />
                            </SheetContent>
                        </Sheet>
                    </div>
                    <Button variant="outline" onClick={() => router.back()} disabled={isSaving} className="hidden sm:inline-flex">
                        Discard
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90">
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Article
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {error && <AlertError2 message={error} onClose={() => setError(null)} />}
            {success && <AlertSuccess2 message={success} />}

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                <ArticleEditor
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                />
                <ArticleSidebar
                    category={category}
                    setCategory={setCategory}
                    isPublished={is_published}
                    setIsPublished={setIsPublished}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                    wordCount={wordCount}
                    categories={categories}
                />
            </div>
        </div>
    );
}
