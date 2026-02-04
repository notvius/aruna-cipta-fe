"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, MonitorPlay, X } from "lucide-react";
import AlertError2 from "@/components/alert-error-2"; 
import { ArticleEditor } from "@/components/molecules/article/ArticleEditor";
import { ArticleSidebar } from "@/components/molecules/article/ArticleSidebar";
import { PreviewArticleModal } from "@/components/organisms/article/PreviewArticleModal";
import { addArticle, updateArticle, generateSlug } from "@/utils/article-storage";
import { getArticleCategories } from "@/utils/article-category-storage";

export function ArticleForm({ mode, initialData, onClose }: any) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState({
        title: initialData?.title || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        category: initialData?.category?.[0],
        is_published: initialData?.is_published || false,
        thumbnail: initialData?.thumbnail || "",
    });

    const [categories, setCategories] = React.useState<any[]>([]);

    React.useEffect(() => {
        const data = getArticleCategories();
        setCategories(data || []);
    }, []);

    const wordCount = React.useMemo(() => {
        const stripHtml = (html: string) => {
            if (typeof document === "undefined") return "";
            const tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        };
        const text = stripHtml(formData.content).trim();
        return text ? text.split(/\s+/).length : 0;
    }, [formData.content]);

    React.useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSave = async () => {
        const strip = (html: string) => html.replace(/<[^>]*>/g, '').trim();
        if (!strip(formData.title)) return setError("Article Title is required.");
        if (!strip(formData.excerpt)) return setError("Article Sub Title is required.");
        if (!strip(formData.content)) return setError("Main Content is required.");
        if (!formData.category) return setError("Please select a category.");
        if (!formData.thumbnail) return setError("Thumbnail image is required.");

        setError(null);
        setIsSaving(true);

        try {
            const now = new Date();
            const payload = {
                ...(mode === "edit" ? initialData : { id: Date.now(), view_count: 0, created_at: now }),
                ...formData,
                slug: generateSlug(formData.title),
                category: [Number(formData.category)],
                updated_at: now,
                published_at: formData.is_published ? now : (mode === "edit" ? initialData.published_at : null)
            };
            
            mode === "create" ? addArticle(payload) : updateArticle(payload);
            await new Promise((resolve) => setTimeout(resolve, 800));
            onClose(mode === "create" ? "Article successfully created!" : "Article successfully updated!");
        } catch (err) {
            setError("Something went wrong while saving.");
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-white font-satoshi overflow-hidden relative">
            <header className="h-16 border-b flex items-center justify-between px-6 shrink-0 bg-white z-[60]">
                <div className="flex items-center gap-4">
                    <h1 className="text-sm font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        {mode === "create" ? "Create New Article" : "Update Article"}
                    </h1>
                </div>
                <div className="flex items-center gap-3 pr-12">
                    <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="font-bold bg-arcipta-orange text-white hover:bg-slate-600 hover:text-white h-10 px-4 rounded-lg">
                        <MonitorPlay className="mr-2 h-4 w-4 text-white" /> Live Preview 
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => onClose()} 
                        className="font-bold text-black px-4 border border-slate-200 hover:bg-slate-50"
                    >
                        Discard
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary hover:opacity-90 text-white font-bold px-6 shadow-sm">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Article
                    </Button>
                </div>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onClose()} 
                    className="absolute right-4 top-3 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 z-[70]"
                >
                    <X className="size-6" />
                </Button>
            </header>

            {error && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto">
                    <AlertError2 message={error} onClose={() => setError(null)} />
                </div>
            )}

            <main className="flex flex-1 overflow-hidden bg-slate-50/50">
                <ArticleEditor 
                    title={formData.title} setTitle={(t: string) => setFormData({...formData, title: t})}
                    excerpt={formData.excerpt} setExcerpt={(e: string) => setFormData({...formData, excerpt: e})}
                    content={formData.content} setContent={(c: string) => setFormData({...formData, content: c})}
                />
                <ArticleSidebar 
                    category={formData.category} setCategory={(c: any) => setFormData({...formData, category: c})}
                    isPublished={formData.is_published} setIsPublished={(v: any) => setFormData({...formData, is_published: v})} 
                    thumbnail={formData.thumbnail} setThumbnail={(t: any) => setFormData({...formData, thumbnail: t})}
                    wordCount={wordCount}
                    categories={categories}
                    onCategoryCreated={() => setCategories(getArticleCategories())}
                />
            </main>
            <PreviewArticleModal article={formData} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />
        </div>
    );
}