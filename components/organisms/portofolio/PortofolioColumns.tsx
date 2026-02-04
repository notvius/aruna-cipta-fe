"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, Trash2, Calendar, MonitorPlay, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Portofolio } from "@/constants/portofolios";
import { getServices } from "@/utils/service-storage";

export const columns = (
    onAddNew: () => void,
    onView: (p: Portofolio) => void,
    onEdit: (p: Portofolio) => void,
    onDelete: (p: Portofolio) => void,
    onPreview: (p: Portofolio) => void
): ColumnDef<Portofolio>[] => [
    { accessorKey: "created_at", header: "Created At", enableHiding: false },
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
        ),
        size: 40,
        enableHiding: false,
    },
    {
        id: "hybrid_content",
        header: "Project Information",
        enableHiding: false,
        cell: ({ row }) => {
            const p = row.original;
            const services = getServices();
            const categoryName = services.find(s => Number(s.id) === Number(p.category?.[0]))?.title || "General";
            
            return (
                <div className="flex items-center gap-4 py-3 min-w-[450px]">
                    <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100 transition-colors duration-300 group-hover:border-arcipta-blue-primary/50">
                        <img 
                            src={p.thumbnail} 
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
                            alt={p.title} 
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <h4 className="font-bold text-slate-900 truncate text-sm tracking-tight transition-colors duration-300 group-hover:text-arcipta-blue-primary font-orbitron capitalize-none uppercase-none">
                                {p.title}
                            </h4>
                            <span className="text-[10px] font-medium text-slate-800 tracking-tight transition-colors duration-300 group-hover:text-arcipta-blue-primary shrink-0 font-satoshi mt-0.5">
                                ( <span className="text-slate-800 tracking-tight transition-colors duration-300 group-hover:text-arcipta-blue-primary">{p.year}</span> )
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">
                                {p.client_name}
                            </span>
                            <Badge 
                                variant="secondary" 
                                className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0 border-none font-bold uppercase group-hover:bg-arcipta-blue-primary/10 group-hover:text-arcipta-blue-primary transition-colors"
                            >
                                {categoryName}
                            </Badge>
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-transparent transition-all duration-300 group-hover:text-arcipta-blue-primary"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 font-satoshi shadow-xl border-slate-100">
                    <DropdownMenuItem onClick={onAddNew}><Plus className="mr-2 h-4 w-4" /> Add New</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onView(row.original)}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPreview(row.original)}><MonitorPlay className="mr-2 h-4 w-4 text-orange-500" /> Live Preview</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(row.original)}><Pencil className="mr-2 h-4 w-4 text-amber-500" /> Edit Portofolio</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete Portofolio</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];