"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getArticleCategories } from "@/utils/article-category-storage";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function PreviewArticleModal({ article, open, onOpenChange }: any) {
    const categories = getArticleCategories();
    const categoryId = Array.isArray(article.category) ? article.category[0] : article.category;
    const categoryName = categories.find((c:any) => c.id === categoryId)?.name || "General";
    
    const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    }) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    React.useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [open]);

    const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') || "";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="fixed inset-0 z-[150] h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 border-none p-0 bg-black rounded-none shadow-none gap-0 overflow-y-auto scrollbar-none text-white"
            >
                <style jsx global>{`
                    [data-state="open"] button.absolute.right-4.top-4 { display: none !important; }
                    .scrollbar-none::-webkit-scrollbar { display: none; }
                `}</style>

                <VisuallyHidden.Root><DialogTitle>Live Preview</DialogTitle></VisuallyHidden.Root>

                <div className="fixed top-8 right-8 z-[200]">
                    <Button 
                        variant="ghost" size="icon" onClick={() => onOpenChange(false)} 
                        className="text-white"
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
=                                <p className="text-xl md:text-3xl font-azeret text-neutral-400 max-w-4xl leading-relaxed">
                                    {stripHtml(article.excerpt) || "No sub-title provided."}
                                </p>
                            </div>
                        </div>

=                        <div className="mb-24">
                            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-lg">
                                <img 
                                    src={article.thumbnail || "https://placehold.co/1440x600/000000/FFFFFF?text=Preview"} 
                                    className="object-cover w-full h-full" 
                                    alt="" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div className="md:col-span-8 md:col-start-3">
                                <div
                                    className="prose prose-xl prose-invert max-w-none leading-relaxed prose-headings:font-orbitron prose-headings:uppercase prose-p:font-satoshi prose-p:text-neutral-300"
                                    dangerouslySetInnerHTML={{ __html: article.content || "<p>Drafting in progress...</p>" }}
                                />
                            </div>
                        </div>
                    </article>
                </main>
            </DialogContent>
        </Dialog>
    );
}