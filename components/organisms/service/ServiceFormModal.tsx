"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { Editor } from "@tinymce/tinymce-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUpload } from "@/components/molecules/gallery/ImageUpload";
import { type Service } from "@/constants/services";
import { Loader2, Save, PlusCircle } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service?: Service | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export function ServiceFormModal({ open, onOpenChange, service, onSuccess, onError }: Props) {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [previewImage, setPreviewImage] = React.useState(""); 
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);

    const isEdit = !!service;

    React.useEffect(() => {
        if (open) {
            setTitle(service?.title || "");
            setContent(service?.content || "");
            setPreviewImage(service?.image_url || "");
            setImageFile(null);
        }
    }, [open, service]);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return onError("Mohon lengkapi semua field");
        if (!isEdit && !imageFile) return onError("Gambar wajib diunggah");

        setIsSaving(true);
        const token = Cookies.get("token");
        const formData = new FormData();
        
        formData.append("title", title);
        formData.append("content", content);
        
        if (imageFile) {
            formData.append("featured_image", imageFile);
        }

        let url = `${process.env.NEXT_PUBLIC_API_URL}/service`;
        if (isEdit && service) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/service/${service.uuid}`;
            formData.append("_method", "PUT");
        }

        try {
            const response = await fetch(url, {
                method: "POST", 
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Terjadi kesalahan pada server");

            onSuccess(isEdit ? "Service berhasil diperbarui" : "Service berhasil dibuat");
            onOpenChange(false);
        } catch (err: any) {
            onError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const labelStyles = "text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-2";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden border-none shadow-2xl font-satoshi bg-white">
                <DialogHeader className="p-8 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase text-slate-900">
                        {isEdit ? "Update Service" : "Add New Service"}
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-slate-500">
                        {isEdit ? "Modifying Service" : "Creating a new entry"}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] w-full border-b border-slate-50">
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className={labelStyles}>Service Title</Label>
                                <Textarea
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Enter service title..."
                                    className="min-h-[120px] rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-arcipta-blue-primary/20 resize-none py-4 px-4 font-bold text-slate-900 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelStyles}>Featured Image</Label>
                                <ImageUpload 
                                    value={previewImage} 
                                    onChange={(base64, file) => {
                                        setPreviewImage(base64); 
                                        if (file) setImageFile(file);
                                    }} 
                                />
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
                                        lazy_render: true,
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
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isSaving}
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 h-10 px-6 flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white rounded-xl h-10 px-8 font-bold text-[10px] uppercase tracking-widest min-w-[120px]">
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <>{isEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />} {isEdit ? "Update Servicee" : "Publish Service"}</>
                        )}
                    </Button>                    
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}