"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Image as ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative aspect-video w-full rounded-md overflow-hidden border group">
                        <img
                            src={value}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
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
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="size-8" />
                        <span className="text-sm font-medium">Click to upload image</span>
                        <span className="text-xs">PNG, JPG or WebP (Max 2MB)</span>
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
