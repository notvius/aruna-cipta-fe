"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Save, Loader2, MonitorPlay, X } from "lucide-react";
import AlertError2 from "@/components/alert-error-2";
import { ArticleEditor } from "@/components/molecules/article/ArticleEditor";
import { ArticleSidebar } from "@/components/molecules/article/ArticleSidebar";
import { PreviewArticleModal } from "@/components/organisms/article/PreviewArticleModal";

export function ArticleForm({ mode, initialData, onClose, categories, onCategoryRefresh }: any) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState({
        title: initialData?.title || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        article_category_id: initialData?.article_category_id || "",
        is_published: initialData?.is_published || false,
        thumbnail: initialData?.thumbnail_url || "",
        thumbnailFile: null as File | null
    });

    const wordCount = React.useMemo(() => {
        const text = formData.content.replace(/<[^>]*>/g, '').trim();
        return text ? text.split(/\s+/).length : 0;
    }, [formData.content]);

    const handleSave = async () => {
        const strip = (html: string) => {
            if (!html) return "";
            return html.replace(/<[^>]*>/g, '').trim();
        };

        const titleValue = formData.title;
        const excerptValue = formData.excerpt;
        const contentValue = formData.content;

        if (!strip(titleValue)) return setError("Article Title is required.");
        if (!strip(excerptValue)) return setError("Article Excerpt (Sub Title) is required.");
        if (!strip(contentValue)) return setError("Article Content is required.");
        if (!formData.article_category_id) return setError("Please select a category.");
        if (!formData.thumbnail && !formData.thumbnailFile) return setError("Thumbnail image is required.");

        setError(null);
        setIsSaving(true);

        const token = Cookies.get("token");
        const body = new FormData();
        
        body.append("title", titleValue);
        body.append("excerpt", excerptValue);
        body.append("content", contentValue);
        body.append("article_category_id", formData.article_category_id.toString());
        body.append("is_published", formData.is_published ? "1" : "0");

        if (formData.thumbnailFile) {
            body.append("thumbnail", formData.thumbnailFile);
        }

        let url = `${process.env.NEXT_PUBLIC_API_URL}/article`;
        if (mode === "edit") {
            url += `/${initialData.uuid}`;
            body.append("_method", "PUT");
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { 
                    "Accept": "application/json", 
                    "Authorization": `Bearer ${token}` 
                },
                body
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 422 && result.errors) {
                    const firstErr = Object.values(result.errors)[0] as string[];
                    throw new Error(firstErr[0]);
                }
                throw new Error(result.message || "Failed to save article");
            }

            onClose(mode === "create" ? "Article successfully created!" : "Article successfully updated!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-white font-satoshi overflow-hidden relative">
            <header className="h-16 border-b flex items-center justify-between px-6 shrink-0 bg-white z-[60]">
                <h1 className="text-sm font-bold font-orbitron uppercase tracking-tight text-slate-900">
                    {mode === "create" ? "Create New Article" : "Update Article"}
                </h1>
                <div className="flex items-center gap-3 pr-12">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsPreviewOpen(true)} 
                        className="bg-arcipta-primary text-white hover:opacity-90 h-10 px-4 rounded-lg"
                    >
                        <MonitorPlay className="mr-2 h-4 w-4" /> Live Preview
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => onClose()} 
                        className="px-4 border border-slate-200 h-10"
                    >
                        Discard
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-arcipta-blue-primary text-white px-8 h-10"
                    >
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
                        Save Article
                    </Button>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onClose()} 
                    className="absolute right-4 top-3 rounded-full z-[70] hover:bg-slate-100 transition-colors"
                >
                    <X className="size-6 text-slate-400" />
                </Button>
            </header>

            {error && (
                <div className="fixed top-20 right-8 z-[200]">
                    <AlertError2 message={error} onClose={() => setError(null)} />
                </div>
            )}

            <main className="flex flex-1 overflow-hidden bg-slate-50/50">
                <ArticleEditor
                    title={formData.title} 
                    setTitle={(t: string) => setFormData({ ...formData, title: t })}
                    excerpt={formData.excerpt} 
                    setExcerpt={(e: string) => setFormData({ ...formData, excerpt: e })}
                    content={formData.content} 
                    setContent={(c: string) => setFormData({ ...formData, content: c })}
                />
                <ArticleSidebar
                    category={formData.article_category_id} 
                    setCategory={(c: any) => setFormData({ ...formData, article_category_id: c })}
                    isPublished={formData.is_published} 
                    setIsPublished={(v: any) => setFormData({ ...formData, is_published: v })}
                    thumbnail={formData.thumbnail}
                    setThumbnail={(v: any, f: any) => setFormData({ ...formData, thumbnail: v, thumbnailFile: f })}
                    wordCount={wordCount}
                    categories={categories}
                    onCategoryCreated={onCategoryRefresh}
                />
            </main>
            <PreviewArticleModal 
                article={formData} 
                open={isPreviewOpen} 
                onOpenChange={setIsPreviewOpen} 
                categories={categories} 
            />
        </div>
    );
}