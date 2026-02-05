"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Pencil, Trash2, Eye, Globe, Lock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type Gallery } from "@/constants/galleries";
import { cn } from "@/lib/utils";

interface GalleryCardProps {
    item: Gallery;
    onAdd: () => void;
    onView: (item: Gallery) => void;
    onEdit: (item: Gallery) => void;
    onDelete: (item: Gallery) => void;
    onToggleStatus: (item: Gallery) => void;
}

export function GalleryCard({ item, onAdd, onView, onEdit, onDelete, onToggleStatus }: GalleryCardProps) {
    const formattedDate = new Date(item.created_at).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short',
        year: '2-digit'
    });

    return (
        <div className="group relative font-satoshi">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-slate-100 border border-slate-200 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-900/10 group-hover:-translate-y-1">
                
                <motion.img 
                    src={item.file_path} 
                    alt={item.alt_text || "Gallery image"}
                    className="absolute inset-0 object-cover w-full h-full"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                />

                <div className="absolute top-5 left-5 z-20">
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border font-black text-[9px] uppercase tracking-widest transition-all duration-300",
                        item.is_published 
                            ? "bg-emerald-500/40 border-emerald-400/30 text-white shadow-lg shadow-emerald-900/20" 
                            : "bg-slate-900/40 border-white/20 text-white"
                    )}>
                        {item.is_published ? <Globe className="size-3 animate-pulse" /> : <Lock className="size-3" />}
                        {item.is_published ? "Published" : "Draft"}
                    </div>
                </div>

                <div className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="h-9 w-9 p-0 rounded-full text-white hover:bg-black/20 hover:text-white backdrop-blur-sm transition-all active:scale-90 shadow-none border-none focus-visible:ring-0"
                            >
                                <MoreHorizontal className="size-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-2xl border-slate-100 p-1.5 font-satoshi">
                            <DropdownMenuItem onClick={onAdd} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <PlusCircle className="mr-2 h-4 w-4 text-emerald-500" /> Add New Asset
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => onView(item)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                            </DropdownMenuItem>

                           <DropdownMenuItem onClick={() => onToggleStatus(item)} className="rounded-lg py-2.5 cursor-pointer font-medium text-arcipta-blue-primary">
                                {item.is_published ? <Lock className="mr-2 h-4 w-4" /> : <Globe className="mr-2 h-4 w-4" />}
                                {item.is_published ? "Set to Draft" : "Publish to Web"}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onEdit(item)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <Pencil className="mr-2 h-4 w-4 text-amber-500" /> Edit Metadata
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                                onClick={() => onDelete(item)}
                                className="rounded-lg py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Asset
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 p-6 bg-gradient-to-t from-black/90 via-black/20 to-transparent pt-12 pointer-events-none">
                    <div className="flex items-end justify-between gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1 leading-none">
                                Caption
                            </p>
                            <h3 className="text-white font-bold text-sm leading-tight line-clamp-1">
                                {item.caption || "Untitled Asset"}
                            </h3>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1 leading-none">
                                Date
                            </p>
                            <span className="text-white/80 font-bold text-[10px] tracking-tighter uppercase">
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}