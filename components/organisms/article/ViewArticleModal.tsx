"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Article, type ArticleCategory } from "@/constants/articles";

interface ViewArticleProps {
    article: Article | null;
    open: boolean;
    onOpenChange: (o: boolean) => void;
    categories: ArticleCategory[];
}

export function ViewArticleModal({ article, open, onOpenChange, categories }: ViewArticleProps) {
    if (!article) return null;

    const getCategoryName = () => {
        if (article.category && typeof article.category === 'object') {
            return article.category.name;
        }
        const catId = article.article_category_id;
        return categories.find(c => String(c.id) === String(catId))?.name || "General";
    };

    const catName = getCategoryName();
    const strip = (html: string) => html?.replace(/<[^>]*>/g, '') || "—";

    const imageUrl = article.thumbnail_url
        ? `${article.thumbnail_url}?t=${new Date(article.updated_at).getTime()}`
        : "/images/placeholder.jpg";

    const formatFullDate = (date: any) => {
        if (!date) return "—";
        return new Date(date).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) + " WIB";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        Article Details
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[85vh] w-full">
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Visibility</p>
                                <Badge className={article.is_published ? 'bg-arcipta-blue-primary text-white' : 'bg-amber-500 text-white'}>
                                    {article.is_published ? 'PUBLISHED' : 'DRAFT'}
                                </Badge>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Category</p>
                                <Badge className={article.category ? 'bg-arcipta-blue-primary text-white' : 'bg-amber-500 text-white'}>
                                    {catName}
                                </Badge>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Title</p>
                                <p className="text-sm font-bold text-slate-900 leading-tight">{strip(article.title)}</p>
                            </div>

                            <div className="space-y-2 border-t border-slate-200/60 pt-4">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Thumbnail</p>
                                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                                    <img src={imageUrl} alt="" className="h-full w-full object-cover" key={article.updated_at} />
                                </div>
                            </div>

                            <div className="space-y-1 border-t border-slate-200/60 pt-4">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Excerpt</p>
                                <p className="text-xs text-slate-500 leading-relaxed">"{strip(article.excerpt)}"</p>
                            </div>

                            <div className="space-y-2 border-t border-slate-200/60 pt-4">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Content</p>
                                <div className="prose prose-sm max-w-none text-slate-600 dangerously-set-html" dangerouslySetInnerHTML={{ __html: article.content }} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 border-t pt-4 pb-2 text-xs">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Engagement</span>
                                <span className="font-bold text-slate-900">{article.view_count || 0} Views</span>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Creation Date</span>
                                <span className="text-slate-900 font-medium">{formatFullDate(article.created_at)}</span>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Last Updated At</span>
                                <span className="text-slate-900 font-medium">{formatFullDate(article.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}