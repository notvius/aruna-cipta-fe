"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTestimonial } from "@/utils/testimonial-storage";
import { Loader2, Save, X } from "lucide-react";
import { Testimonial } from "@/constants/testimonials";
import { cn } from "@/lib/utils";

interface TestimonialFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial?: Testimonial | null; 
    onSave?: (t: Testimonial) => void;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export function TestimonialFormModal({ 
    open, 
    onOpenChange, 
    testimonial, 
    onSave, 
    onSuccess, 
    onError 
}: TestimonialFormProps) {
    const [form, setForm] = React.useState({ name: "", title: "", content: "" });
    const [isSaving, setIsSaving] = React.useState(false);

    const isEdit = !!testimonial;

    React.useEffect(() => {
        if (open) {
            if (testimonial) {
                setForm({ 
                    name: testimonial.client_name, 
                    title: testimonial.client_title, 
                    content: testimonial.content 
                });
            } else {
                setForm({ name: "", title: "", content: "" });
            }
        }
    }, [open, testimonial]);

    const handleSave = async () => {
        if (!form.name.trim()) return onError("Client name is required");
        if (!form.title.trim()) return onError("Client title is required");
        if (!form.content.trim()) return onError("Testimonial content is required");

        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 800));
            const now = new Date();

            if (isEdit && testimonial && onSave) {
    
                onSave({ 
                    ...testimonial, 
                    client_name: form.name, 
                    client_title: form.title, 
                    content: form.content, 
                    updated_at: now 
                });
                onSuccess("Testimonial successfully updated!");
            } else {
                
                addTestimonial({
                    id: Date.now(),
                    client_name: form.name,
                    client_title: form.title,
                    content: form.content,
                    created_at: now,
                    updated_at: now,
                });
                onSuccess("Testimonial successfully created!");
            }
            onOpenChange(false);
        } catch (err) {
            onError("Something went wrong while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputFocus = "focus-visible:ring-2 focus-visible:ring-arcipta-blue-primary/20 focus-visible:border-arcipta-blue-primary transition-all duration-300";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl font-satoshi" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase tracking-tight text-slate-900">
                        {isEdit ? "Update Testimonial" : "Add New Testimonial"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground tracking-tight">
                        {isEdit ? "Modify existing client feedback" : "Create a new entry for your testimonial section"}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-5">
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Client Name</Label>
                        <Input 
                            value={form.name} 
                            onChange={e => setForm({ ...form, name: e.target.value })} 
                            placeholder="e.g. John Doe"
                            className={cn("rounded-xl h-11 bg-slate-50/50 border-slate-200 font-medium text-slate-700", inputFocus)}
                            disabled={isSaving}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Position / Company</Label>
                        <Input 
                            value={form.title} 
                            onChange={e => setForm({ ...form, title: e.target.value })} 
                            placeholder="e.g. CEO at TechHouse"
                            className={cn("rounded-xl h-11 bg-slate-50/50 border-slate-200 font-medium text-slate-700", inputFocus)}
                            disabled={isSaving}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Client Feedback</Label>
                        <Textarea 
                            value={form.content} 
                            onChange={e => setForm({ ...form, content: e.target.value })} 
                            placeholder="What did the client say about Arcipta?"
                            className={cn("min-h-[120px] rounded-xl bg-slate-50/50 border-slate-200 font-medium text-slate-700 resize-none py-3", inputFocus)}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 flex gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isSaving}
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-100 h-10 px-6"
                    >
                        Discard
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="bg-arcipta-blue-primary hover:opacity-90 text-white rounded-xl h-10 px-8 shadow-sm font-bold text-[10px] uppercase tracking-widest min-w-[120px]"
                    >
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> saving...</>
                        ) : (
                            <><Save className="mr-1 h-3 w-3" /> {isEdit ? "Update" : "Publish"}</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}