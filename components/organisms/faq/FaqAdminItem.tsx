"use client";

import * as React from "react";
import { Plus, Minus, Pencil, Trash2, Eye, MoreHorizontal, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type Faq } from "@/constants/faqs";
import { cn } from "@/lib/utils";

interface FaqItemProps {
    faq: Faq;
    isOpen: boolean;
    onToggle: () => void;
    onCreate: () => void; 
    onEdit: (faq: Faq) => void;
    onDelete: (faq: Faq) => void;
    onView: (faq: Faq) => void;
    dragHandleProps?: any;
}

export function FaqAdminItem({ faq, isOpen, onToggle, onCreate, onEdit, onDelete, onView, dragHandleProps }: FaqItemProps) {
    return (
        <div className="border-b border-slate-200 py-5 group bg-white px-2 transition-colors duration-300 hover:bg-slate-50/30">
            <div className="flex justify-between gap-4 items-center">
                {/* Drag Handle */}
                <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-arcipta-blue-primary transition-colors shrink-0">
                    <GripVertical size={20} />
                </div>

                {/* Question Text */}
                <div className="flex-1 cursor-pointer min-w-0" onClick={onToggle}>
                    <h3 className={cn(
                        "font-bold text-lg sm:text-xl transition-colors duration-300 truncate font-creato",
                        isOpen ? "text-[#FF6B00]" : "text-slate-900 group-hover:text-[#FF6B00]"
                    )}>
                        {faq.question}
                    </h3>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0 hover:bg-transparent transition-all duration-300 group-hover:text-arcipta-blue-primary"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-42 font-satoshi shadow-xl border-slate-100 p-1">
                                <DropdownMenuItem onClick={onCreate} className="cursor-pointer font-medium">
                                    <Plus className="mr-2 h-4 w-4 text-emerald-500" /> Add New 
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onView(faq)} className="cursor-pointer font-medium">
                                    <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(faq)} className="cursor-pointer font-medium">
                                    <Pencil className="mr-2 h-4 w-4 text-amber-500" /> Edit FAQ 
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onDelete(faq)} 
                                    className="text-red-600 focus:text-red-600 cursor-pointer font-medium"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete FAQ
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="cursor-pointer text-[#FF6B00] hover:scale-110 transition-transform shrink-0" onClick={onToggle}>
                        {isOpen ? <Minus size={22} strokeWidth={3} /> : <Plus size={22} strokeWidth={3} />}
                    </div>
                </div>
            </div>

            {/* Answer Content */}
            <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out font-satoshi",
                isOpen ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
            )}>
                <div className="pr-12 pl-9">
                    <p className="text-slate-500 leading-relaxed text-sm sm:text-base font-medium py-2">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    );
}