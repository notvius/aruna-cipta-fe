"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DualImageUploadProps {
    values: string[];
    onChange: (values: string[]) => void;
    className?: string;
}

export function DualImageUpload({ values, onChange, className }: DualImageUploadProps) {
    const fileInputRef1 = React.useRef<HTMLInputElement>(null);
    const fileInputRef2 = React.useRef<HTMLInputElement>(null);
    const [loading1, setLoading1] = React.useState(false);
    const [loading2, setLoading2] = React.useState(false);

    const image1 = values[0] || "";
    const image2 = values[1] || "";

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("Kegedean bro, maksimal 2MB ya untuk gambar proses.");
            return;
        }

        const setLoading = index === 0 ? setLoading1 : setLoading2;
        setLoading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            const newValues = [...values];
            while (newValues.length <= index) newValues.push("");
            newValues[index] = reader.result as string;
            onChange(newValues);
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const renderUploadBox = (
        index: number, 
        currentImage: string, 
        ref: React.RefObject<HTMLInputElement | null>, 
        loading: boolean
    ) => {
        return (
            <div className="flex-1">
                <div 
                    onClick={() => !loading && ref.current?.click()}
                    className={cn(
                        "relative aspect-square w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer group",
                        currentImage ? "border-solid border-slate-200" : "hover:border-arcipta-blue-primary bg-slate-50/50"
                    )}
                >
                    {currentImage ? (
                        <>
                            <img src={currentImage} alt={`Process ${index + 1}`} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    size="sm" 
                                    className="absolute top-3 right-3 rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white h-8 text-[10px] font-bold"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        ref.current?.click();
                                    }}
                                >
                                    <Upload className="mr-1.5 h-3 w-3" /> CHANGE
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-arcipta-blue-primary transition-colors p-4 text-center">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                            <span className="text-[11px] font-medium italic">Upload Image {index + 1}</span>
                        </div>
                    )}
                </div>
                
                <input 
                    type="file" 
                    ref={ref} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(index, e)} 
                />
            </div>
        );
    };

    return (
        <div className={cn("grid grid-cols-2 gap-4 w-full", className)}>
            {renderUploadBox(0, image1, fileInputRef1, loading1)}
            {renderUploadBox(1, image2, fileInputRef2, loading2)}
        </div>
    );
}