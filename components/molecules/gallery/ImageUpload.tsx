"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string;
    onChange: (value: string, file?: File) => void;
    className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [loading, setLoading] = React.useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("File terlalu besar, maksimal 10MB.");
            return;
        }

        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(reader.result as string, file);
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const onRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("", undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className={cn("w-full", className)}>
            <div 
                onClick={() => !loading && fileInputRef.current?.click()}
                className={cn(
                    "relative aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer group",
                    value ? "border-solid border-slate-200" : "hover:border-arcipta-blue-primary bg-slate-50/50"
                )}
            >
                {value ? (
                    <>
                        <img src={value} alt="Preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute top-3 right-3 flex gap-2">
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    size="sm" 
                                    className="rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white h-8 text-[10px] font-bold"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    <Upload className="mr-1.5 h-3 w-3" /> CHANGE
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="icon" 
                                    className="rounded-full shadow-lg h-8 w-8"
                                    onClick={onRemove}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-arcipta-blue-primary transition-colors p-4 text-center">
                        {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
                        <span className="text-xs font-bold uppercase tracking-wider">Upload Featured Image</span>
                        <span className="text-[10px] opacity-60 font-medium">PNG, JPG or JPEG (Max 10MB)</span>
                    </div>
                )}
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
        </div>
    );
}