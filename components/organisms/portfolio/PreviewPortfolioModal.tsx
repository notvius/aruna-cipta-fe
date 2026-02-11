"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function PreviewPortfolioModal({ open, onOpenChange, data, services, isLoading }: any) {
    
    const getSafeUrl = (img: any) => {
        if (!img) return "";
        if (typeof img === 'string') {
            if (img.startsWith('http') || img.startsWith('blob:')) return img;
            return `${process.env.NEXT_PUBLIC_ASSET_URL}/${img}`;
        }
        try {
            return URL.createObjectURL(img);
        } catch (e) {
            return "";
        }
    };

    const getCategoryName = () => {
        if (!data) return "Category";
        
        const rawCategory = (data as any)?.services || data?.category || (data as any)?.category_id;
        
        if (Array.isArray(rawCategory) && rawCategory.length > 0) {
            const first = rawCategory[0];
            const id = typeof first === 'object' ? (first.id || first.service_id) : first;
            const match = services?.find((s: any) => String(s.id) === String(id));
            return match ? match.title : (typeof first === 'object' ? first.title : "Category");
        }
        
        if (rawCategory && typeof rawCategory === 'object') {
            return rawCategory.title || "Category";
        }

        const matchById = services?.find((s: any) => String(s.id) === String(rawCategory));
        return matchById ? matchById.title : "Category";
    };

    const categoryName = getCategoryName();
    const content = data?.content || {};
    const processImages = content?.thumbnail_urls || content?.image_urls || content?.image_process || [];

    React.useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [open]);

    if (!open || !data) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="fixed inset-0 z-[200] h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 border-none p-0 bg-black rounded-none shadow-none gap-0 overflow-y-auto scrollbar-none outline-none"
                style={{ backgroundColor: '#000000' }}
            >
                <style jsx global>{`
                    [data-state="open"] button.absolute.right-4.top-4 { display: none !important; }
                    .scrollbar-none::-webkit-scrollbar { display: none; }
                `}</style>

                <VisuallyHidden.Root><DialogTitle>Live Preview Portfolio</DialogTitle></VisuallyHidden.Root>
                
                <div className="fixed top-8 right-8 z-[250]">
                    <Button
                        variant="ghost" size="icon" onClick={() => onOpenChange(false)}
                        className="text-white hover:bg-white/10 rounded-full"
                    >
                        <X className="size-8" />
                    </Button>
                </div>

                {isLoading ? (
                    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-black">
                        <Loader2 className="size-10 animate-spin text-arcipta-blue-primary" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Syncing with Server...</p>
                    </div>
                ) : (
                    <main className="min-h-screen text-white font-satoshi" style={{ backgroundColor: '#000000' }}>
                        <article className="pt-40 pb-20 px-6 max-w-[1440px] mx-auto">
                            <div className="mb-20 border-b border-white/10 pb-10">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-sm uppercase tracking-widest text-neutral-500 font-bold font-satoshi">
                                        {data?.client_name || "Client"} — {data?.year || "Year"}
                                    </span>
                                    <span className="text-sm uppercase tracking-widest text-neutral-500 font-bold font-satoshi">
                                        {categoryName}
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-8xl font-black leading-tight max-w-4xl tracking-tighter uppercase font-orbitron">
                                    {data?.title || "Untitled Project"}
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-y-32">
                                <aside className="md:col-span-3 md:sticky md:top-32 h-fit">
                                    <div className="flex flex-col gap-8">
                                        <div>
                                            <h3 className="text-xs uppercase tracking-widest mb-2 text-neutral-500 font-bold">Role</h3>
                                            <p className="text-lg font-bold">{data?.role || "Role not specified"}</p>
                                        </div>
                                        <div className="w-full h-px bg-white/10"></div>
                                        <p className="text-sm leading-relaxed text-neutral-400">
                                            This case study focuses on business strategy and problem solving, not just a visual showcase.
                                        </p>
                                    </div>
                                </aside>

                                <div className="md:col-span-8 md:col-start-5 flex flex-col gap-20 text-neutral-300 font-satoshi">
                                    <section>
                                        <h2 className="text-3xl font-bold mb-6 text-white uppercase font-orbitron">Context</h2>
                                        <p className="text-lg leading-relaxed">{content?.context || "No context provided."}</p>
                                    </section>

                                    <div className="w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                                        {data?.thumbnail_url || data?.thumbnail ? (
                                            <img 
                                                src={getSafeUrl(data?.thumbnail_url || data?.thumbnail)} 
                                                className="w-full h-full object-cover" 
                                                alt="Main Thumbnail" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <p className="uppercase text-neutral-600 font-bold text-xs tracking-widest">No Thumbnail</p>
                                            </div>
                                        )}
                                    </div>

                                    <section>
                                        <h2 className="text-3xl font-bold mb-6 text-white uppercase font-orbitron">The Challenge</h2>
                                        <p className="text-lg leading-relaxed">{content?.challenge || "No challenge described."}</p>
                                    </section>

                                    <section>
                                        <h2 className="text-3xl font-bold mb-6 text-white uppercase font-orbitron">Our Approach</h2>
                                        <p className="text-lg leading-relaxed">{content?.approach || "No approach described."}</p>
                                    </section>

                                    <div className="grid grid-cols-2 gap-4">
                                        {processImages.length > 0 ? (
                                            processImages.map((img: any, i: number) => (
                                                <div key={i} className="aspect-square bg-neutral-900 rounded-2xl overflow-hidden border border-white/5">
                                                    <img 
                                                        src={getSafeUrl(img)} 
                                                        className="w-full h-full object-cover opacity-80 transition-opacity hover:opacity-100" 
                                                        alt={`Process ${i + 1}`} 
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div className="aspect-square bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/5">
                                                    <p className="uppercase text-[10px] text-neutral-700 font-bold tracking-widest">Process A</p>
                                                </div>
                                                <div className="aspect-square bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/5">
                                                    <p className="uppercase text-[10px] text-neutral-700 font-bold tracking-widest">Process B</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <section className="p-10 bg-arcipta-blue-primary/10 rounded-3xl border border-arcipta-blue-primary/20">
                                        <h2 className="text-3xl font-bold mb-6 text-arcipta-blue-primary uppercase font-orbitron">Business Impact</h2>
                                        <p className="text-xl md:text-2xl leading-relaxed text-white font-bold italic">
                                            {content?.impact ? `"${content.impact}"` : "No business impact recorded."}
                                        </p>
                                    </section>
                                </div>
                            </div>
                        </article>
                    </main>
                )}
            </DialogContent>
        </Dialog>
    );
}