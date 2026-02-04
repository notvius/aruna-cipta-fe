"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Article } from "@/constants/articles";
import { getArticleCategories } from "@/utils/article-category-storage";

export function ViewArticleModal({ article, open, onOpenChange }: { article: Article | null, open: boolean, onOpenChange: (o: boolean) => void }) {
    if (!article) return null;
    const categories = getArticleCategories();
    const catName = article.category.map((id: number) => categories.find(c => c.id === id)?.name).join(", ") || "General";

    const strip = (html: string) => html?.replace(/<[^>]*>/g, '') || "—";

    const formatFullDate = (date: any) => {
        if (!date) return "—";
        return new Date(date).toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "long",
            year: "numeric"
        }) + " WIB";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] font-satoshi p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">Article Details</DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[85vh] w-full">
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Visibility</p>
                                <Badge className={article.is_published ? 'bg-arcipta-blue-primary' : 'bg-amber-500'}>
                                    {article.is_published ? 'PUBLISHED' : 'DRAFT'}
                                </Badge>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Category</p>
                                <p className="font-bold text-slate-900">{catName}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Title</p>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{strip(article.title)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Slug Path</p>
                                    <p className="text-xs font-medium text-arcipta-blue-primary">/articles/{article.slug}</p>
                                </div>

                                <div className="space-y-1 border-t border-slate-200/60 pt-4">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Excerpt</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">"{strip(article.excerpt)}"</p>
                                </div>
                                
                                <div className="space-y-2 border-t border-slate-200/60 pt-4">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Thumbnail</p>
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                                        <img 
                                            src={article.thumbnail} 
                                            alt="" 
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-slate-200/60 pt-4">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Content</p>
                                    <div 
                                        className="prose prose-sm max-w-none text-slate-600 prose-p:leading-relaxed prose-headings:text-slate-900"
                                        dangerouslySetInnerHTML={{ __html: article.content }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 border-t pt-4 pb-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Engagement Stats</span>
                                <span className="px-2 py-1 rounded-md font-bold text-slate-900">{article.view_count.toLocaleString()} Views</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Creation Date</span>
                                <span className="px-2 py-1 rounded-md text-slate-900 font-medium">{formatFullDate(article.created_at)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Last Update At</span>
                                <span className="text-black px-2 py-1 rounded-md font-medium">{formatFullDate(article.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}