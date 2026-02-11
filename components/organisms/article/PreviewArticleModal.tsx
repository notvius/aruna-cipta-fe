"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function PreviewArticleModal({ article, open, onOpenChange, categories }: any) {
    const [imgSrc, setImgSrc] = React.useState("https://placehold.co/1440x600/000000/FFFFFF?text=Loading...");

    const getCategoryName = () => {
        if (article.category && typeof article.category === 'object') {
            return article.category.name;
        }
        const catId = article.article_category_id;
        return categories.find((c: any) => String(c.id) === String(catId))?.name || "General";
    };

    const categoryName = getCategoryName();

    const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString("id-ID", {
        year: "numeric", month: "long", day: "numeric"
    }) : new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });

    const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') || "";

    React.useEffect(() => {
        if (open && article) {
            const currentSrc = (article.thumbnail && (article.thumbnail.startsWith('data:image') || article.thumbnail.startsWith('blob:')))
                ? article.thumbnail
                : (article.thumbnail_url || article.thumbnail);

            if (currentSrc) {
                setImgSrc(currentSrc);
            }
        }
    }, [open, article]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="fixed inset-0 z-[150] h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 border-none p-0 bg-black rounded-none shadow-none gap-0 overflow-y-auto scrollbar-none text-white outline-none"
            >
                <style jsx global>{`
                    [data-state="open"] button.absolute.right-4.top-4 { display: none !important; }
                    .scrollbar-none::-webkit-scrollbar { display: none; }
                `}</style>

                <VisuallyHidden.Root><DialogTitle>Live Preview</DialogTitle></VisuallyHidden.Root>

                <div className="fixed top-8 right-8 z-[200]">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        className="text-white hover:bg-white/10 rounded-full"
                    >
                        <X className="size-8" />
                    </Button>
                </div>

                <main className="min-h-screen bg-black text-white font-satoshi pb-32">
                    <article className="pt-32 md:pt-48 pb-20 px-6 max-w-[1440px] mx-auto">
                        <div className="mb-20">
                            <div className="flex flex-col gap-10">
                                <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                    <span className="font-bold text-sm uppercase tracking-[0.3em] text-orange-500 font-azeret">
                                        {categoryName}
                                    </span>
                                    <span className="text-sm uppercase tracking-widest text-neutral-500 font-azeret">
                                        {dateStr}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-8xl font-black leading-[1.05] max-w-5xl font-orbitron uppercase tracking-tighter">
                                    {stripHtml(article.title) || "Untitled Article"}
                                </h1>
                                <p className="text-xl md:text-3xl font-azeret text-neutral-400 max-w-4xl leading-relaxed">
                                    {stripHtml(article.excerpt) || "No sub-title provided."}
                                </p>
                            </div>
                        </div>

                        <div className="mb-24">
                            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-lg bg-neutral-900 border border-white/10">
                                <img
                                    src={imgSrc}
                                    className="object-cover w-full h-full opacity-90 transition-opacity duration-500"
                                    alt="Preview"
                                    key={imgSrc}
                                    onError={() => setImgSrc("https://placehold.co/1440x600/000000/FFFFFF?text=Image+Not+Found")}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div className="md:col-span-8 md:col-start-3">
                                <div
                                    className="prose prose-xl prose-invert max-w-none leading-relaxed prose-headings:font-orbitron prose-headings:uppercase prose-p:font-satoshi prose-p:text-neutral-300"
                                    dangerouslySetInnerHTML={{
                                        __html: article.content || "<p>Drafting in progress...</p>"
                                    }}
                                />
                            </div>
                        </div>
                    </article>
                </main>
            </DialogContent>
        </Dialog>
    );
}