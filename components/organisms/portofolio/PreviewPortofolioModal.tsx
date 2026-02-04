"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServices } from "@/utils/service-storage";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function PreviewPortofolioModal({ open, onOpenChange, data, content }: any) {
    const services = getServices();
    
    const categoryName = services.find(s => Number(s.id) === Number(data?.category))?.title || "Category";

    React.useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [open]);

    if (!data || !content) return null;

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
                        className="text-white hover:bg-white"
                    >
                        <X className="size-8" />
                    </Button>
                </div>

                <main className="min-h-screen text-white font-satoshi" style={{ backgroundColor: '#000000' }}>
                    <article className="pt-40 pb-20 px-6 max-w-[1440px] mx-auto">
                        
                        <div className="mb-20 border-b border-white/10 pb-10">
                            <div className="flex justify-between items-end mb-6">
                                <span className="font-azeret text-sm uppercase tracking-widest text-neutral-500">
                                    {data?.client_name || "Client"} — {data?.year || "Year"}
                                </span>
                                <span className="font-azeret text-sm uppercase tracking-widest text-neutral-500">
                                    {categoryName}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-creato font-black leading-tight max-w-4xl tracking-tighter">
                                {data?.title || "Untitled Project"}
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-y-32">
                            <div className="md:col-span-3 md:sticky md:top-32 h-fit">
                                <div className="flex flex-col gap-8">
                                    <div>
                                        <h3 className="font-azeret text-xs uppercase tracking-widest mb-2 text-neutral-500">
                                            Role
                                        </h3>
                                        <p className="font-creato text-lg">{data?.role || "Role not specified"}</p>
                                    </div>
                                    <div className="w-full h-px bg-white/10"></div>
                                    <p className="font-azeret text-sm leading-relaxed text-neutral-400">
                                        Study case ini fokus pada strategi bisnis dan penyelesaian masalah, bukan sekadar showcase visual.
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-8 md:col-start-5 flex flex-col gap-20 text-neutral-300">
                                <section>
                                    <h2 className="text-3xl font-creato mb-6 text-white">Context</h2>
                                    <p className="font-azeret text-lg leading-relaxed">
                                        {content?.context || "No context provided."}
                                    </p>
                                </section>

                                <div className="w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-white/5">
                                    {data?.thumbnail ? (
                                        <img src={data.thumbnail} className="w-full h-full object-cover" alt="Context" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <p className="font-azeret uppercase text-neutral-600">Visual Placeholder: Context</p>
                                        </div>
                                    )}
                                </div>

                                <section>
                                    <h2 className="text-3xl font-creato mb-6 text-white">The Challenge</h2>
                                    <p className="font-azeret text-lg leading-relaxed">
                                        {content?.challenge || "No challenge described."}
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-3xl font-creato mb-6 text-white">Our Approach</h2>
                                    <p className="font-azeret text-lg leading-relaxed">
                                        {content?.approach || "No approach described."}
                                    </p>
                                </section>

                                <div className="grid grid-cols-2 gap-4">
                                    {content?.image_process?.map((img: string, i: number) => (
                                        <div key={i} className="aspect-square bg-neutral-900 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center">
                                            {img ? (
                                                <img src={img} className="w-full h-full object-cover opacity-80" alt={`Process ${i}`} />
                                            ) : (
                                                <p className="font-azeret uppercase text-xs text-neutral-600 font-bold">Process {i === 0 ? 'A' : 'B'}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <section className="p-10 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl border border-orange-500/20">
                                    <h2 className="text-3xl font-creato mb-6 text-orange-600 dark:text-orange-400">
                                        Business Impact
                                    </h2>
                                    <p className="font-azeret text-xl md:text-2xl leading-relaxed text-white">
                                        "{content?.impact || "No business impact recorded."}"
                                    </p>
                                </section>
                            </div>
                        </div>
                    </article>
                </main>
            </DialogContent>
        </Dialog>
    );
}