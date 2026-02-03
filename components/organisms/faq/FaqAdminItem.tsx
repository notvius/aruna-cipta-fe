"use client";

import * as React from "react";
import { Plus, Minus, Pencil, Trash2, Eye, ChevronDown, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type Faq } from "@/constants/faqs";

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
        <div className="border-b border-border py-6 group bg-background px-2">
            <div className="flex justify-between gap-4 items-center">
                <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <GripVertical size={20} />
                </div>

                <div className="flex-1 cursor-pointer" onClick={onToggle}>
                    <h3 className={`font-creato text-lg sm:text-xl transition-colors duration-300 ${
                        isOpen ? "text-[#FF6B00]" : "text-foreground group-hover:text-[#FF6B00]"
                    }`}>
                        {faq.question}
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-fit p-0 hover:bg-transparent shadow-none border-none">
                                    <Badge variant="outline" className="cursor-pointer bg-arcipta-blue-primary text-white py-1">
                                        Action <ChevronDown className="ml-1 h-3 w-3" />
                                    </Badge>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onClick={onCreate}>
                                    <Plus className="mr-2 h-4 w-4" /> Create New
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onView(faq)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(faq)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit FAQ
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete(faq)} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="cursor-pointer text-[#FF6B00] shrink-0" onClick={onToggle}>
                        {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                    </div>
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}>
                <p className="font-azeret text-muted-foreground leading-relaxed pr-12 pl-9 text-sm sm:text-base">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
}