"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Save, Loader2, X, Briefcase, FileText, MonitorPlay, Type, User, Calendar, Tag, Layers, Star, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { DualImageUpload } from "@/components/molecules/gallery/DualImageUpload";
import { cn } from "@/lib/utils";
import { PreviewPortfolioModal } from "./PreviewPortfolioModal";

export function PortfolioForm({ mode, initialData, onClose, services, isLoading }: any) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    const [formData, setFormData] = React.useState({
        title: initialData?.title || "", 
        client_name: initialData?.client_name || "", 
        year: initialData?.year || "", 
        service_id: (initialData?.service_id || initialData?.service?.id)?.toString() || "", 
        role: initialData?.role || "", 
        problem: initialData?.problem || "", 
        solution: initialData?.solution || "", 
        thumbnail: initialData?.thumbnail_url || "", 
        thumbnailFile: null as File | null
    });

    const [contentData, setContentData] = React.useState({
        context: initialData?.content?.context || "", 
        challenge: initialData?.content?.challenge || "", 
        approach: initialData?.content?.approach || "", 
        impact: initialData?.content?.impact || "", 
        image_process: initialData?.content?.image_urls || ["", ""], 
        processFiles: [null, null] as (File | null)[]
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                client_name: initialData.client_name || "",
                year: initialData.year || "",
                service_id: (initialData.service_id || initialData.service?.id)?.toString() || "",
                role: initialData.role || "",
                problem: initialData.problem || "",
                solution: initialData.solution || "",
                thumbnail: initialData.thumbnail_url || "",
                thumbnailFile: null
            });

            setContentData({
                context: initialData.content?.context || "",
                challenge: initialData.content?.challenge || "",
                approach: initialData.content?.approach || "",
                impact: initialData.content?.impact || "",
                image_process: initialData.content?.image_urls || ["", ""],
                processFiles: [null, null]
            });
        }
    }, [initialData]);

    const handleSave = async () => {
        if (!formData.title || !formData.client_name || !formData.year || !formData.service_id || !formData.role || !formData.problem || !formData.solution) {
            return setError("Please fill in all required fields.");
        }
        if (!formData.thumbnail && !formData.thumbnailFile) return setError("Thumbnail image is required.");

        setError(null);
        setIsSaving(true);

        const token = Cookies.get("token");
        const body = new FormData();
        
        console.log("Service ID State:", formData.service_id);

        body.set('title', formData.title);
        body.set('client_name', formData.client_name);
        body.set('year', formData.year);
        body.set('service_id', formData.service_id);
        body.set('role', formData.role);
        body.set('problem', formData.problem);
        body.set('solution', formData.solution);
        
        if (formData.thumbnailFile) {
            body.set('thumbnail', formData.thumbnailFile);
        }

        body.set('content[context]', contentData.context);
        body.set('content[challenge]', contentData.challenge);
        body.set('content[approach]', contentData.approach);
        body.set('content[impact]', contentData.impact);

        contentData.processFiles.forEach((file) => {
            if (file) body.append('content[images][]', file);
        });

        if (mode === "edit") {
            body.set('_method', 'PUT');
        }

        console.log("Service ID FormData:", body.get('service_id'));

        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        const url = mode === "edit" ? `${baseUrl}/portfolio/${initialData.uuid}` : `${baseUrl}/portfolio`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Accept": "application/json" 
                },
                body
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 422 && result.errors) {
                    const firstErr = Object.values(result.errors)[0] as string[];
                    throw new Error(firstErr[0]);
                }
                throw new Error(result.message || "Failed to save data");
            }

            onClose(mode === "edit" ? "Portfolio updated successfully!" : "Portfolio created successfully!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const labelStyles = "text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 mb-2";
    const focusStyles = "focus-visible:ring-1 focus-visible:ring-arcipta-blue-primary/40 focus-visible:border-arcipta-blue-primary/40 transition-all";

    return (
        <div className="flex flex-col h-screen w-full bg-white font-satoshi overflow-hidden relative">
            <header className="h-16 border-b flex items-center justify-between px-6 shrink-0 bg-white z-[60]">
                <div className="flex items-center gap-4">
                    <h1 className="text-sm font-bold uppercase tracking-tight text-slate-900 border-r pr-4 border-slate-200 py-1">
                        {mode === "create" ? "Add New Portfolio" : "Update Portfolio"}
                    </h1>
                </div>
                <div className="flex items-center gap-3 pr-12">
                    <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="bg-arcipta-primary text-white hover:opacity-90 h-10 px-4 rounded-lg">
                        <MonitorPlay className="mr-2 h-4 w-4" /> Live Preview
                    </Button>
                    <Button variant="ghost" onClick={() => onClose()} className="px-4 border border-slate-200 rounded-lg h-10">Discard</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary text-white px-8 rounded-lg h-10">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Portfolio
                    </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onClose()} className="absolute right-4 top-3 rounded-full z-[70] hover:bg-slate-100 transition-colors">
                    <X className="size-6 text-slate-400" />
                </Button>
            </header>

            <main className="flex flex-1 overflow-hidden bg-slate-50/50">
                <div className="flex-1 overflow-y-auto p-12 scrollbar-none">
                    <div className="max-w-4xl mx-auto space-y-12 pb-20">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-widest border border-red-100">
                                {error}
                            </div>
                        )}
                        <div className="bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm space-y-8">
                            <div className="flex items-center gap-3 text-arcipta-blue-primary font-bold uppercase text-[10px] tracking-widest border-b border-arcipta-blue-primary/10 pb-4">
                                <Briefcase className="size-4" /> Brief Overview
                            </div>
                            <div className="grid gap-8">
                                <div className="space-y-2">
                                    <Label className={labelStyles}>The Problem</Label>
                                    <Textarea value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} className={cn("min-h-[120px] rounded-2xl bg-slate-50/50 p-4 border-slate-200", focusStyles)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className={labelStyles}>The Solution</Label>
                                    <Textarea value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} className={cn("min-h-[120px] rounded-2xl bg-slate-50/50 p-4 border-slate-200", focusStyles)} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm space-y-8">
                            <div className="flex items-center gap-3 text-orange-500 font-bold uppercase text-[10px] tracking-widest border-b border-orange-500/10 pb-4">
                                <FileText className="size-4" /> Case Study Details
                            </div>
                            <div className="grid gap-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className={labelStyles}>Project Context</Label>
                                        <Textarea value={contentData.context} onChange={e => setContentData({...contentData, context: e.target.value})} className={cn("min-h-[140px] rounded-2xl bg-slate-50/50 p-4 border-slate-200", focusStyles)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={labelStyles}>Specific Challenges</Label>
                                        <Textarea value={contentData.challenge} onChange={e => setContentData({...contentData, challenge: e.target.value})} className={cn("min-h-[140px] rounded-2xl bg-slate-50/50 p-4 border-slate-200", focusStyles)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className={labelStyles}>Development Approach</Label>
                                    <Textarea value={contentData.approach} onChange={e => setContentData({...contentData, approach: e.target.value})} className={cn("min-h-[120px] rounded-2xl bg-slate-50/50 p-4 border-slate-200", focusStyles)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className={labelStyles}>Process Visuals</Label>
                                    <DualImageUpload values={contentData.image_process} onChange={(p: any, f: any) => setContentData({...contentData, image_process: p, processFiles: f})} />
                                </div>
                                <div className="bg-arcipta-blue-primary/5 p-8 rounded-2xl border border-arcipta-blue-primary/10 space-y-4">
                                    <Label className={cn(labelStyles, "text-arcipta-blue-primary")}>Key Business Impact</Label>
                                    <Textarea value={contentData.impact} onChange={e => setContentData({...contentData, impact: e.target.value})} className={cn("min-h-[100px] rounded-xl bg-white p-4 font-bold border-none shadow-inner", focusStyles)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="w-[360px] border-l bg-white p-8 space-y-10 overflow-y-auto shrink-0 scrollbar-none shadow-[20px_0_30px_rgba(0,0,0,0.02)_inset]">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <Label className={labelStyles}><Type className="size-3.5" /> Project Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={cn("rounded-xl h-11 bg-slate-50/50 px-4 font-bold", focusStyles)} />
                        </div>
                        <div className="space-y-3">
                            <Label className={labelStyles}><User className="size-3.5" /> Client Identity</Label>
                            <Input value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} className={cn("rounded-xl h-11 bg-slate-50/50 px-4 font-bold", focusStyles)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className={labelStyles}><Calendar className="size-3.5" /> Year</Label>
                                <Input value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className={cn("rounded-xl h-11 bg-slate-50/50 px-4 font-bold", focusStyles)} />
                            </div>
                            <div className="space-y-3">
                                <Label className={labelStyles}><Layers className="size-3.5" /> Team Role</Label>
                                <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={cn("rounded-xl h-11 bg-slate-50/50 px-4 font-bold", focusStyles)} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className={labelStyles}><Tag className="size-3.5" /> Pick Service</Label>
                            <div className="relative">
                                <select
                                    value={formData.service_id}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData(prev => ({ ...prev, service_id: val }));
                                    }}
                                    className={cn(
                                        "w-full appearance-none rounded-xl h-11 bg-white border border-slate-200 px-4 pr-10 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-arcipta-blue-primary/40 focus:border-arcipta-blue-primary/40 transition-all",
                                        !formData.service_id && "text-slate-400"
                                    )}
                                >
                                    <option value="" disabled>Select Service Category...</option>
                                    {services.map((s: any) => (
                                        <option key={s.id} value={s.id.toString()}>
                                            {s.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronsUpDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none text-slate-500" />
                            </div>
                        </div>
                        <div className="space-y-4 pt-6 mt-6 border-t border-slate-100">
                            <Label className={labelStyles}><Star className="size-3.5" /> Featured Thumbnail</Label>
                            <ImageUpload value={formData.thumbnail} onChange={(v: any, f: any) => setFormData({...formData, thumbnail: v, thumbnailFile: f})} />
                        </div>
                    </div>
                </aside>
            </main>
            <PreviewPortfolioModal open={isPreviewOpen} onOpenChange={setIsPreviewOpen} data={formData} content={contentData} services={services} />
        </div>
    );
}