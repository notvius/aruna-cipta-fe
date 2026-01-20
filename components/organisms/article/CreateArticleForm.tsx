"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Settings } from "lucide-react";
import { ArticleEditor } from "@/components/molecules/article/ArticleEditor";
import { ArticleSidebar } from "@/components/molecules/article/ArticleSidebar";
import { addArticle } from "@/utils/article-storage";
import { Article } from "@/constants/articles";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function CreateArticleForm() {
    const router = useRouter();
    const [isSaving, setIsSaving] = React.useState(false);

    // Form State
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [status, setStatus] = React.useState<"Published" | "Unpublished">("Unpublished");
    const [thumbnail, setThumbnail] = React.useState("");

    // Stats
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    const handleSave = async () => {
        if (!title.trim()) return alert("Please enter a title");

        setIsSaving(true);

        const now = new Date().toISOString();
        const newArticle: Article = {
            id: `ART-${Date.now()}`,
            title,
            content,
            category,
            status,
            thumbnail: thumbnail || "/images/logo_arcipta.png",
            createdAt: now,
            updatedAt: now,
            publishedAt: status === "Published" ? now : undefined,
            views: 0,
        };

        addArticle(newArticle);

        // Simulate minor delay for UX
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsSaving(false);
        router.push("/article");
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
                        <span className="text-sm font-medium leading-none">Create New Article</span>
                        <span className="text-xs text-muted-foreground hidden sm:block">Draft saved locally</span>
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
                                    status={status}
                                    setStatus={setStatus}
                                    thumbnail={thumbnail}
                                    setThumbnail={setThumbnail}
                                    wordCount={wordCount}
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
                    status={status}
                    setStatus={setStatus}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                    wordCount={wordCount}
                />
            </div>
        </div>
    );
}
