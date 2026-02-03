"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type Gallery } from "@/constants/galleries";

interface GalleryCardProps {
    item: Gallery;
    onView: (item: Gallery) => void;
    onEdit: (item: Gallery) => void;
    onDelete: (item: Gallery) => void;
    onToggleStatus: (item: Gallery) => void;
}

export function GalleryCard({ item, onView, onEdit, onDelete, onToggleStatus }: GalleryCardProps) {
    return (
        <motion.div 
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted group border border-border"
            initial={false}
        >
            {/* Background Image - Tetap di posisi, hanya zoom */}
            <motion.img 
                src={item.file_path} 
                alt={item.alt_text}
                className="absolute inset-0 object-cover w-full h-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            />

            {/* Fixed Action Button - Pojok Kanan Atas */}
            <div className="absolute top-3 right-3 z-30">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="secondary" 
                            className="h-8 w-8 p-0 rounded-full bg-white/90 backdrop-blur-md border-none shadow-sm hover:bg-white transition-colors"
                        >
                            <MoreVertical className="h-4 w-4 text-slate-800" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-2xl">
                        <DropdownMenuItem onClick={() => onView(item)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Photo
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete(item)}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Immersive Overlay - Perbaikan Blink dengan Motion Props */}
            <motion.div 
                className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div 
                    className="flex flex-col gap-3"
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="space-y-1">
                        <h3 className="text-white font-bold text-base leading-tight">
                            {item.caption}
                        </h3>
                        <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
                            {item.alt_text || "No Alt Description"}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-tighter">
                            {item.is_published ? "Published" : "Draft Mode"}
                        </span>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Switch 
                                checked={item.is_published}
                                onCheckedChange={() => onToggleStatus(item)}
                                className="data-[state=checked]:bg-arcipta-blue-primary scale-75"
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}