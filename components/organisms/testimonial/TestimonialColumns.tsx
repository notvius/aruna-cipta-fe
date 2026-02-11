"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, Trash2, PlusCircle, Quote } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { type Testimonial } from "@/constants/testimonials";

export const columns = ({
    onCreate,
    onView,
    onEdit,
    onDeleteSingle,
}: {
    onCreate: () => void;
    onView: (t: Testimonial) => void;
    onEdit: (t: Testimonial) => void;
    onDeleteSingle: (t: Testimonial) => void;
}): ColumnDef<Testimonial>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="pl-4">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="pl-4">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(v) => row.toggleSelected(!!v)}
                    />
                </div>
            ),
            size: 50,
            enableHiding: false,
        },
        {
            id: "hybrid_content",
            header: () => (
                <div className="pl-2 font-bold text-slate-900 font-outfit uppercase tracking-wider text-[11px]">
                    Client Feedback
                </div>
            ),
            enableHiding: false,
            cell: ({ row }) => {
                const t = row.original;
                const initial = t.client_name?.charAt(0).toUpperCase() || "?";

                return (
                    <div className="flex items-start gap-4 py-3 pl-2 min-w-[500px] flex-1 group/cell overflow-hidden font-jakarta">
                        <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/row:border-arcipta-blue-primary group-hover/row:bg-arcipta-blue-primary/5">
                            <span className="text-slate-900 font-bold text-xs group-hover/row:text-arcipta-blue-primary transition-colors duration-300">
                                {initial}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <div className="flex flex-col">
                                <h4 className="font-bold text-slate-900 text-sm tracking-tight capitalize transition-colors duration-300 group-hover/row:text-arcipta-blue-primary">
                                    {t.client_name}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">
                                    {t.client_title}
                                </span>
                            </div>

                            <div className="relative pl-5 pr-4">
                                <Quote
                                    className="absolute left-0 top-0.5 size-3.5 text-slate-300 rotate-180"
                                    strokeWidth={3}
                                />
                                <p className="text-slate-600 text-[13px] leading-relaxed line-clamp-2 break-words font-medium">
                                    {t.content}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: () => (
                <div className="font-bold text-slate-900 font-outfit uppercase tracking-wider text-[11px]">
                    Activity Log
                </div>
            ),
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                return (
                    <div className="flex flex-col gap-0.5 min-w-[160px] shrink-0 font-jakarta">
                        <div className="flex items-center gap-1.5">
                            <div className="size-1.5 rounded-full bg-slate-400" />
                            <span className="text-[11px] font-bold text-slate-700">
                                {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold pl-3">
                            {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: () => (
                <div className="pl-2 font-bold text-slate-900 font-outfit uppercase tracking-wider text-[11px]">
                    Actions
                </div>
            ),
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex justify-start items-center pl-2 min-w-[80px]">
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
                            <DropdownMenuItem onClick={onCreate} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <PlusCircle className="mr-2 h-4 w-4 text-emerald-500" />
                                Add New
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onView(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onEdit(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                                <Pencil className="mr-2 h-4 w-4 text-amber-500" />
                                Edit Testimonial
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => onDeleteSingle(row.original)}
                                className="rounded-lg py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Testimonial
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];
