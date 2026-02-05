"use client";

import * as React from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { addService, updateService } from "@/utils/service-storage";
import { type Service } from "@/constants/services";
import { Loader2, ImageIcon, Type, Save, PlusCircle } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service?: Service | null;
    onSave?: (updated: Service) => void;
    onSuccess: (msg: string) => void; 
    onError: (msg: string) => void;   
}

export function ServiceFormModal({ open, onOpenChange, service, onSave, onSuccess, onError }: Props) {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [featured_image, setFeaturedImage] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);

    const isEdit = !!service;

    React.useEffect(() => {
        if (open) {
            setTitle(service?.title || "");
            setContent(service?.content || "");
            setFeaturedImage(service?.featured_image || "");
        }
    }, [open, service]);

    const handleSave = async () => {
        if (!featured_image.trim()) return onError("Featured image is required");
        if (!title.trim()) return onError("Service title is required");
        if (!content.trim()) return onError("Service description is required");

        setIsSaving(true);

        try {
            const now = new Date();
            const successMsg = isEdit ? "Service updated successfully!" : "New service has been successfully created!";

            if (isEdit && service) {
                const updated = { ...service, title, content, featured_image, updated_at: now };
                updateService(updated);
                if (onSave) onSave(updated);
            } else {
                addService({ id: Date.now(), title, content, featured_image, created_at: now, updated_at: now });
            }

            onOpenChange(false);

            setTimeout(() => {
                onSuccess(successMsg);
            }, 300); 

        } catch (err) {
            onError("An error occurred while saving. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const labelStyles = "text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-2";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden border-none shadow-2xl font-satoshi" onInteractOutside={e => e.preventDefault()}>
                <DialogHeader className="p-8 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase text-slate-900">
                        {isEdit ? "Update Service" : "Add New Service"}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] w-full border-b border-slate-50">
                    <div className="p-8 space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className={labelStyles}>
                                    Service Title
                                </Label>
                                <Textarea 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)} 
                                    placeholder="Enter service title..."
                                    className="min-h-[120px] rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-arcipta-blue-primary/20 resize-none py-4 px-4 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelStyles}>
                                     Featured Image
                                </Label>
                                <ImageUpload value={featured_image} onChange={setFeaturedImage} />
                            </div>
                        </div>

                        <div className="space-y-2 pb-4">
                            <Label className={labelStyles}>Content</Label>
                            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                <Editor
                                    apiKey="k7l6wxymdavx8maeydx2yo2w2pvaw8oo2b9ados6cp1ju2k8"
                                    init={{ 
                                        height: 350, 
                                        menubar: false, 
                                        branding: false,
                                        content_style: 'body { font-family: Satoshi, sans-serif; font-size: 14px; }' 
                                    }}
                                    value={content}
                                    onEditorChange={setContent}
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-8 flex gap-3 bg-white">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 px-8 border">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-arcipta-blue-primary text-white rounded-xl h-10 px-10 font-bold text-[10px] uppercase tracking-widest min-w-[200px]">
                        {isSaving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        {isSaving ? " Processing..." : isEdit ? " Update Service" : " Save Service"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}