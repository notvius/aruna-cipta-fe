"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [loading, setLoading] = React.useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Kegedean bro, maksimal 5MB ya.");
            return;
        }

        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(reader.result as string);
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={cn("w-full", className)}>
            <div 
                onClick={() => !loading && fileInputRef.current?.click()}
                className={cn(
                    "relative aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer group",
                    value ? "border-solid border-muted" : "hover:border-arcipta-blue-primary bg-muted/10"
                )}
            >
                {value ? (
                    <>
                        <img src={value} alt="Preview" className="h-full w-full object-cover" />
                        {/* Tombol Change di Pojok Kanan Atas */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                                type="button" 
                                variant="secondary" 
                                size="sm" 
                                className="absolute top-3 right-3 rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                <Upload className="mr-2 h-3 w-3" /> Change
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-arcipta-blue-primary transition-colors">
                        {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
                        <span className="text-sm font-medium italic">Klik untuk upload foto</span>
                        <span className="text-[10px] uppercase opacity-60 font-bold">Maksimal 5MB</span>
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