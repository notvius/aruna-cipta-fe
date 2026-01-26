"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DualImageUploadProps {
    values: string[];
    onChange: (values: string[]) => void;
    className?: string;
}

export function DualImageUpload({ values, onChange, className }: DualImageUploadProps) {
    const fileInputRef1 = React.useRef<HTMLInputElement>(null);
    const fileInputRef2 = React.useRef<HTMLInputElement>(null);

    const image1 = values[0] || "";
    const image2 = values[1] || "";

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        const MAX_SIZE = 500 * 1024; // 500KB
        if (file.size > MAX_SIZE) {
            alert("Image size must be less than 500KB to save space. Please use a smaller image or compress it.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const newValues = [...values];
            while (newValues.length <= index) newValues.push("");

            newValues[index] = reader.result as string;
            onChange(newValues);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = (index: number) => {
        const newValues = [...values];
        if (newValues[index]) {
            newValues[index] = "";
            onChange(newValues);
        }
        if (index === 0 && fileInputRef1.current) fileInputRef1.current.value = "";
        if (index === 1 && fileInputRef2.current) fileInputRef2.current.value = "";
    };

    const renderUploadBox = (index: number, currentImage: string, ref: React.RefObject<HTMLInputElement | null>) => {
        return (
            <div className="flex-1">
                <div className="flex items-center gap-4">
                    {currentImage ? (
                        <div className="relative aspect-video w-full rounded-md overflow-hidden border group">
                            <img
                                src={currentImage}
                                alt={`Upload preview ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemove(index)}
                                    type="button"
                                >
                                    <X className="size-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-arcipta-blue-primary hover:border-arcipta-blue-primary transition-colors cursor-pointer bg-muted/50"
                            onClick={() => ref.current?.click()}
                        >
                            <Upload className="size-8" />
                            <span className="text-sm font-medium">Image {index + 1}</span>
                            <span className="text-xs">PNG, JPG (Max 500KB)</span>
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
        <div className={cn("grid grid-cols-2 gap-4", className)}>
            {renderUploadBox(0, image1, fileInputRef1)}
            {renderUploadBox(1, image2, fileInputRef2)}
        </div>
    );
}
