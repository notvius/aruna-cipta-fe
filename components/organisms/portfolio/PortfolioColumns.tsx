"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, Trash2, MonitorPlay, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Portfolio } from "@/constants/portfolios";
import { type Service } from "@/constants/services";

export const columns = (
    onAddNew: () => void,
    onView: (p: Portfolio) => void,
    onEdit: (p: Portfolio) => void,
    onDelete: (p: Portfolio) => void,
    onPreview: (p: Portfolio) => void,
    services: any[]
): ColumnDef<Portfolio>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="w-fit pl-2 flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-fit pl-2 flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(v) => row.toggleSelected(!!v)}
                    />
                </div>
            ),
            size: 40,
        },
        {
            id: "hybrid_content",
            header: () => (
                <div className="pl-0 font-bold text-slate-900">
                    Project Information
                </div>
            ),
            cell: ({ row }) => {
                const p = row.original;
                
                const getServiceTitle = () => {
                    if (p.service && typeof p.service === 'object') {
                        return (p.service as any).title || (p.service as any).name;
                    }
                    const sId = p.service_id || p.service_id;
                    if (sId) {
                        const found = services.find(s => String(s.id) === String(sId));
                        if (found) return found.title;
                    }

                    return "General";
                };

                const serviceTitle = getServiceTitle();
                const imageUrl = p.thumbnail_url
                    ? `${p.thumbnail_url}?t=${new Date(p.updated_at).getTime()}`
                    : (p.thumbnail?.startsWith('http') ? p.thumbnail : `${process.env.NEXT_PUBLIC_ASSET_URL}/${p.thumbnail}`);

                return (
                    <div className="flex items-center gap-4 py-3 pl-0 group/item min-w-[400px]">
                        <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100">
                            <img
                                src={imageUrl}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                                alt={p.title}
                                key={p.uuid}
                                onError={(e: any) => { e.target.src = "https://placehold.co/600x400?text=Image+Error"; }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <h4 className="font-bold text-slate-900 truncate text-sm tracking-tight group-hover/item:text-arcipta-blue-primary transition-colors">
                                    {p.title}
                                </h4>
                                <span className="text-[10px] font-bold text-slate-400 tracking-tight shrink-0 mt-0.5">({p.year})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">{p.client_name}</span>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0 border-none font-bold uppercase shrink-0 h-4">
                                    {getServiceTitle()}
                                </Badge>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: () => (
                <div className="font-bold text-slate-900">
                    Created At
                </div>
            ),
            size: 150,
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-slate-700">
                        {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                    </span>
                </div>
            )
        },
        {
            id: "actions",
            header: () => (
                <div className="pl-2 font-bold text-slate-900">
                    Actions
                </div>
            ),
            size: 80,
            cell: ({ row }) => (
                <div className="flex justify-start items-center pl-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-slate-100 transition-all duration-300 rounded-full group-hover/row:text-arcipta-blue-primary"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-2xl border-slate-100 p-1.5 font-jakarta bg-white">
                            <DropdownMenuItem onClick={onAddNew} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <PlusCircle className="mr-2 h-4 w-4 text-emerald-500" /> Add New Portfolio
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPreview(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <MonitorPlay className="mr-2 h-4 w-4 text-orange-500" /> Live Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <Pencil className="mr-2 h-4 w-4 text-amber-500" /> Edit Portfolio
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(row.original)}
                                className="rounded-lg py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Portfolio
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];