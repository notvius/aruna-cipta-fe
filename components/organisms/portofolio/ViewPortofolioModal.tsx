"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Portofolio } from "@/constants/portofolios";
import { getPortofolioContentById } from "@/utils/portofolio-content-storage";
import { getServices } from "@/utils/service-storage";
import { Label } from "@/components/ui/label";

export function ViewPortofolioModal({ portofolio, open, onOpenChange }: { portofolio: Portofolio | null, open: boolean, onOpenChange: (o: boolean) => void }) {
    if (!portofolio) return null;
    const services = getServices();
    const techContent = getPortofolioContentById(portofolio.id);
    const catName = services.find(s => Number(s.id) === Number(portofolio.category?.[0]))?.title || "General";

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
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">Portfolio Details</DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="max-h-[85vh] w-full">
                    <div className="p-6 space-y-6">
                        {/* Header Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Client Name</p>
                                <p className="font-bold text-slate-900">{portofolio.client_name}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Category</p>
                                <Badge className="bg-arcipta-blue-primary">{catName}</Badge>
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Project Title</p>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{portofolio.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Year / Role</p>
                                        <p className="text-xs font-medium text-slate-700">{portofolio.year} — {portofolio.role || "Consultant"}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Slug Path</p>
                                        <p className="text-xs font-medium text-arcipta-blue-primary">/portfolio/{portofolio.slug}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 border-t border-slate-200/60 pt-4">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Thumbnail</p>
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                                        <img src={portofolio.thumbnail} alt="" className="h-full w-full object-cover" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-200/60 pt-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-red-400 tracking-widest">The Problem</p>
                                        <p className="text-xs text-slate-500 leading-relaxed italic">"{portofolio.problem || "—"}"</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-green-500 tracking-widest">The Solution</p>
                                        <p className="text-xs text-slate-600 leading-relaxed">"{portofolio.solution || "—"}"</p>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-slate-200/60 pt-4">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Content Details</p>
                                    <div className="space-y-4 text-xs text-slate-600">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><Label className="text-[10px] font-bold text-slate-900">CONTEXT:</Label> <p className="leading-relaxed">{techContent?.context || "—"}</p></div>
                                            <div><Label className="text-[10px] font-bold text-slate-900">CHALLENGE:</Label> <p className="leading-relaxed">{techContent?.challenge || "—"}</p></div>
                                        </div>
                                        
                                        <div><Label className="text-[10px] font-bold text-slate-900">OUR APPROACH:</Label> <p className="leading-relaxed">{techContent?.approach || "—"}</p></div>
                                        
                                        {techContent?.image_process && techContent.image_process.some(img => img !== "") && (
                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                {techContent.image_process.map((img, i) => img && (
                                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="bg-arcipta-blue-primary/5 p-4 rounded-xl border border-arcipta-blue-primary/10">
                                            <Label className="text-[10px] font-bold text-arcipta-blue-primary uppercase tracking-widest block mb-1">Business Impact:</Label>
                                            <p className="font-medium text-slate-900 text-sm">"{techContent?.impact || "—"}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logs Info */}
                        <div className="grid grid-cols-1 gap-3 pt-4 pb-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Created At</span>
                                <span className="px-2 py-1 rounded-md text-slate-900 font-medium">{formatFullDate(portofolio.created_at)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-tighter">Last Update At</span>
                                <span className="text-black px-2 py-1 rounded-md font-medium">{formatFullDate(portofolio.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}