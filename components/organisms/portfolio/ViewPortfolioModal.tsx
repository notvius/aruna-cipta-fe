import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Portfolio } from "@/constants/portfolios";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ViewPortfolioModal({ portfolio, open, onOpenChange, services }: { portfolio: Portfolio | null, open: boolean, onOpenChange: (o: boolean) => void, services: any[] }) {
    if (!portfolio) return null;

    const getCategoryName = () => {
        const rawCategory = (portfolio as any).services || portfolio.category || (portfolio as any).category_id;
        
        if (Array.isArray(rawCategory) && rawCategory.length > 0) {
            const first = rawCategory[0];
            const id = typeof first === 'object' ? (first.id || first.service_id) : first;
            const match = services.find(s => String(s.id) === String(id));
            return match ? match.title : (typeof first === 'object' ? first.title : "General");
        }
        
        if (rawCategory && typeof rawCategory === 'object') {
            return rawCategory.title || "General";
        }

        const matchById = services.find(s => String(s.id) === String(rawCategory));
        return matchById ? matchById.title : "General";
    };

    const catName = getCategoryName();
    const techContent = portfolio.content;

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

    const getSafeUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_ASSET_URL}/${url}`;
    };

    const labelStyle = "text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1.5 block";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white rounded-3xl">
                <DialogHeader className="p-8 pb-0">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-bold uppercase tracking-tight text-slate-900">Portfolio Details</DialogTitle>
                        </div>
                        <Badge className="bg-arcipta-blue-primary/10 text-arcipta-blue-primary border-none font-bold uppercase tracking-widest text-[9px] px-3 py-1 rounded-full">
                            {catName}
                        </Badge>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[80vh] w-full">
                    <div className="p-8 pt-6 space-y-10">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-1 sm:col-span-2">
                                    <span className={labelStyle}>Project Title</span>
                                    <p className="text-lg font-bold text-slate-900 leading-tight uppercase">{portfolio.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className={labelStyle}>Client Identity</span>
                                    <p className="font-bold text-slate-900 uppercase">{portfolio.client_name}</p>
                                </div>
                            </div>

                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-50 group">
                                <img
                                    src={portfolio.thumbnail_url || getSafeUrl(portfolio.thumbnail)}
                                    alt={portfolio.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                                <div className="space-y-2">
                                    <span className={cn(labelStyle, "text-red-400")}>The Problem</span>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">"{portfolio.problem || "—"}"</p>
                                </div>
                                <div className="space-y-2">
                                    <span className={cn(labelStyle, "text-green-500")}>The Solution</span>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">"{portfolio.solution || "—"}"</p>
                                </div>
                            </div>
                        </div>

                        {techContent && (
                            <div className="space-y-8 border-t border-slate-100 pt-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <span className={labelStyle}>Context</span>
                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{techContent.context || "—"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className={labelStyle}>Challenge</span>
                                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{techContent.challenge || "—"}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className={labelStyle}>Our Approach</span>
                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{techContent.approach || "—"}</p>
                                </div>

                                <div className="space-y-3">
                                    <span className={labelStyle}>Workflow Process</span>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(techContent.thumbnail_urls || techContent.image_urls || []).map((url, i) => (
                                            <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                                                <img src={getSafeUrl(url)} className="w-full h-full object-cover" alt={`Process ${i + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-arcipta-blue-primary/5 p-8 rounded-2xl border border-arcipta-blue-primary/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-arcipta-blue-primary/5 rounded-full -mr-12 -mt-12" />
                                    <span className={cn(labelStyle, "text-arcipta-blue-primary")}>Key Impact</span>
                                    <p className="font-bold text-slate-900 text-base italic leading-relaxed">
                                        "{techContent.impact || "—"}"
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between gap-4 py-6 border-t border-slate-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Project Registered</span>
                                <span className="text-xs text-slate-900 font-bold">{formatFullDate(portfolio.created_at)}</span>
                            </div>
                            <div className="flex flex-col gap-1 sm:text-right">
                                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Resource Updated</span>
                                <span className="text-xs text-slate-900 font-bold">{formatFullDate(portfolio.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}