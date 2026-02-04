"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, X, Plus, Briefcase, FileText, Globe, MonitorPlay, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import AlertError2 from "@/components/alert-error-2";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { DualImageUpload } from "@/components/molecules/gallery/DualImageUpload";
import { addPortofolio, updatePortofolio, generateSlug } from "@/utils/portofolio-storage";
import { getPortofolioContentById, addOrUpdatePortofolioContent } from "@/utils/portofolio-content-storage";
import { getServices } from "@/utils/service-storage";
import { cn } from "@/lib/utils";
import { PreviewPortofolioModal } from "./PreviewPortofolioModal";

export function PortofolioForm({ mode, initialData, onClose }: any) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const services = getServices();

    const [formData, setFormData] = React.useState({
        title: initialData?.title || "",
        client_name: initialData?.client_name || "",
        year: initialData?.year || "",
        category: initialData?.category?.[0] || "",
        role: initialData?.role || "",
        problem: initialData?.problem || "",
        solution: initialData?.solution || "",
        thumbnail: initialData?.thumbnail || "",
    });

    const [contentData, setContentData] = React.useState({
        context: "",
        challenge: "",
        approach: "",
        image_process: ["", ""],
        impact: "",
    });

    const selectedCategoryName = React.useMemo(() => {
        if (!formData.category || !services) return "Select category...";
        return services.find((s: any) => s.id.toString() === formData.category.toString())?.title || "Select category...";
    }, [formData.category, services]);

    React.useEffect(() => {
        if (mode === "edit" && initialData) {
            const tech = getPortofolioContentById(initialData.id);
            if (tech) setContentData({ 
                context: tech.context || "",
                challenge: tech.challenge || "",
                approach: tech.approach || "",
                image_process: tech.image_process || ["", ""],
                impact: tech.impact || "",
            });
        }
    }, [mode, initialData]);

    const handleSave = async () => {
        setError(null);

        const isFormIncomplete = 
            !formData.title.trim() || 
            !formData.client_name.trim() ||
            !formData.category || 
            !formData.thumbnail ||
            !formData.problem.trim() ||
            !formData.solution.trim() ||
            !contentData.context.trim() ||
            !contentData.challenge.trim() ||
            !contentData.impact.trim();

        if (isFormIncomplete) {
            setError("All fields are mandatory. Please check Project Identity, Overview, and Content Detail.");
            const scrollContainer = document.querySelector('.overflow-y-auto');
            if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSaving(true);

        try {
            const now = new Date();
            const pId = mode === "edit" ? initialData.id : Date.now();
            const pPayload = { ...formData, id: pId, slug: generateSlug(formData.title), category: [Number(formData.category)], updated_at: now, created_at: mode === "edit" ? initialData.created_at : now };
            const cPayload = { ...contentData, portofolio_id: pId, id: mode === "edit" ? (getPortofolioContentById(pId)?.id || Date.now() + 1) : Date.now() + 1 };

            mode === "create" ? addPortofolio(pPayload) : updatePortofolio(pPayload);
            addOrUpdatePortofolioContent(cPayload);

            await new Promise(r => setTimeout(r, 800));
            onClose(mode === "create" ? "Portfolio successfully created!" : "Portfolio successfully updated!");
        } catch (err) {
            setError("Something went wrong while saving.");
            setIsSaving(false);
        }
    };

    const inputFocus = "focus-visible:ring-2 focus-visible:ring-arcipta-blue-primary/20 focus-visible:border-arcipta-blue-primary transition-all duration-300";

    return (
        <div className="flex flex-col h-screen w-full bg-white font-satoshi overflow-hidden relative">
            <header className="h-16 border-b flex items-center justify-between px-8 shrink-0 bg-white z-[60]">
                <div className="flex items-center gap-4">
                    <h1 className="text-sm font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        {mode === "create" ? "Create New Case Study" : "Update Case Study"}
                    </h1>
                </div>
                <div className="flex items-center gap-3 pr-12">
                    <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="font-medium bg-arcipta-orange text-white hover:bg-slate-600 hover:text-white h-10 px-4 rounded-lg">
                        <MonitorPlay className="mr-2 h-4 w-4 text-white" /> Live Preview 
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => onClose()} 
                        className="font-medium text-black px-4 border border-slate-200 hover:bg-slate-300"
                    >
                        Discard
                    </Button>                    
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary hover:opacity-90 text-white font-medium px-8 shadow-sm">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Case Study
                    </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onClose()} className="absolute right-4 top-3 rounded-full hover:bg-slate-100 text-slate-400 z-[70] transition-colors"><X className="size-6" /></Button>
            </header>

            {error && (
                <div className="fixed top-20 right-8 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
                    <AlertError2 message={error} onClose={() => setError(null)} />
                </div>
            )}

            <main className="flex flex-1 overflow-hidden bg-slate-50/50">
                <div className="flex-1 overflow-y-auto p-12 scrollbar-none">
                    <div className="max-w-4xl mx-auto space-y-12 pb-20">
                        <div className="space-y-8 bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm">
                            <div className="flex items-center gap-3 text-arcipta-blue-primary font-bold uppercase text-[10px] tracking-[0.2em]">
                                <Briefcase className="size-4" />
                                Overview Details
                            </div>
                            <div className="grid gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">The Problem</Label>
                                    <Textarea value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} className={cn("min-h-[120px] rounded-2xl resize-none bg-slate-50/50 border-slate-200", inputFocus)} placeholder="Describe the client's pain points..." />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">The Solution</Label>
                                    <Textarea value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} className={cn("min-h-[120px] rounded-2xl resize-none bg-slate-50/50 border-slate-200", inputFocus)} placeholder="How did Arcipta solve the issue?" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 bg-white p-10 rounded-3xl border border-slate-200/60 shadow-sm">
                            <div className="flex items-center gap-3 text-orange-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                                <FileText className="size-4" />
                                Content Detail
                            </div>
                            <div className="grid gap-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Project Context</Label>
                                        <Textarea value={contentData.context} onChange={e => setContentData({...contentData, context: e.target.value})} className={cn("min-h-[150px] rounded-2xl resize-none bg-slate-50/50 border-slate-200", inputFocus)} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">The Challenge</Label>
                                        <Textarea value={contentData.challenge} onChange={e => setContentData({...contentData, challenge: e.target.value})} className={cn("min-h-[150px] rounded-2xl resize-none bg-slate-50/50 border-slate-200", inputFocus)} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Process Images</Label>
                                    <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200/50">
                                        <DualImageUpload values={contentData.image_process} onChange={(val: string[]) => setContentData({...contentData, image_process: val})} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Our Approach</Label>
                                    <Textarea value={contentData.approach} onChange={e => setContentData({...contentData, approach: e.target.value})} className={cn("min-h-[120px] rounded-2xl resize-none bg-slate-50/50 border-slate-200", inputFocus)} />
                                </div>
                                <div className="space-y-3 pt-4">
                                    <Label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Key Business Impact</Label>
                                    <Textarea value={contentData.impact} onChange={e => setContentData({...contentData, impact: e.target.value})} className={cn("min-h-[120px] rounded-2xl resize-none bg-slate-50/50 border-slate-200 font-bold text-slate-900", inputFocus)} placeholder="Tangible results (e.g. 20% growth)..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="w-[340px] border-l bg-white flex flex-col h-full font-satoshi shrink-0 overflow-hidden">
                    <div className="p-6 space-y-8 overflow-y-auto scrollbar-none">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Project Title</Label>
                                <Input 
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                    className={cn("rounded-xl h-11 bg-slate-50/50 border-slate-200 font-medium text-slate-600 hover:ring-2 hover:ring-arcipta-blue-primary/20 hover:border-arcipta-blue-primary", inputFocus)} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Client Name</Label>
                                <Input 
                                    value={formData.client_name} 
                                    onChange={e => setFormData({...formData, client_name: e.target.value})} 
                                    className={cn("rounded-xl h-11 bg-slate-50/50 border-slate-200 font-medium text-slate-600 hover:ring-2 hover:ring-arcipta-blue-primary/20 hover:border-arcipta-blue-primary", inputFocus)} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Year</Label>
                                    <Input 
                                        value={formData.year} 
                                        onChange={e => setFormData({...formData, year: e.target.value})} 
                                        className={cn("rounded-xl h-11 bg-slate-50/50 border-slate-200 font-medium text-slate-600 hover:ring-2 hover:ring-arcipta-blue-primary/20 hover:border-arcipta-blue-primary", inputFocus)} 
                                        placeholder="2026" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Role</Label>
                                    <Input 
                                        value={formData.role} 
                                        onChange={e => setFormData({...formData, role: e.target.value})} 
                                        className={cn("rounded-xl h-11 bg-slate-50/50 border-slate-200 font-medium text-slate-600 hover:ring-2 hover:ring-arcipta-blue-primary/20 hover:border-arcipta-blue-primary", inputFocus)} 
                                        placeholder="Consultant" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</p>
                                <div className={cn(
                                    "rounded-xl border transition-all duration-300 group",
                                    open 
                                        ? "ring-2 ring-arcipta-blue-primary/20 border-arcipta-blue-primary" 
                                        : "border-transparent hover:ring-2 hover:ring-arcipta-blue-primary/20 hover:border-arcipta-blue-primary"
                                )}>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button 
                                                variant="outline" role="combobox" aria-expanded={open} 
                                                className="w-full justify-between rounded-xl h-11 border-slate-200 font-medium text-slate-600 focus:ring-0 hover:bg-white hover:text-slate-600 bg-white"
                                            >
                                                {selectedCategoryName}
                                                <ChevronsUpDown className={cn("ml-2 h-4 w-4 shrink-0 transition-colors", open ? "text-arcipta-blue-primary" : "opacity-50 group-hover:text-arcipta-blue-primary group-hover:opacity-100")} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[290px] p-0 z-[200]">
                                            <Command>
                                                <CommandInput placeholder="Search or create..." value={searchQuery} onValueChange={setSearchQuery} />
                                                <CommandList className="scrollbar-none">
                                                    <CommandEmpty className="p-2 text-xs text-slate-400 text-center py-2">No category found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {services.map((s: any) => (
                                                            <CommandItem 
                                                                key={s.id} value={s.title} 
                                                                onSelect={() => { setFormData({...formData, category: s.id.toString()}); setOpen(false); }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", formData.category.toString() === s.id.toString() ? "opacity-100" : "opacity-0")} />
                                                                {s.title}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Thumbnail</p>
                            <div className={cn("rounded-xl overflow-hidden border border-slate-100 bg-slate-50/30 p-1 hover:ring-2 hover:ring-arcipta-blue-primary/20 hover:border-arcipta-blue-primary transition-all duration-300")}>
                                <ImageUpload value={formData.thumbnail} onChange={v => setFormData({...formData, thumbnail: v})} />
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
            <PreviewPortofolioModal open={isPreviewOpen} onOpenChange={setIsPreviewOpen} data={formData} content={contentData} />
        </div>
    );
}