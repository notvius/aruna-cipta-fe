"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { type Service } from "@/constants/services";

const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

const truncateWords = (text: string, limit: number) => {
    const words = text.split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
};

export const columns = ({
    onCreate,
    onView,
    onEdit,
    onDeleteSingle,
}: {
    onCreate: () => void;
    onView: (t: Service) => void;
    onEdit: (t: Service) => void;
    onDeleteSingle: (t: Service) => void;
}): ColumnDef<Service>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Service Information",
        cell: ({ row }) => {
            const service = row.original;
            const plainText = stripHtml(row.original.content);
            const truncatedText = truncateWords(plainText, 10);
            const imageUrl = service.image_url 
                ? `${service.image_url}?t=${new Date(service.updated_at).getTime()}` 
                : "/images/placeholder.jpg";
            
            return (
                <div className="flex items-center gap-4 py-2 group/cell cursor-default">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm transition-all duration-500">
                        <img 
                            src={imageUrl} 
                            alt={row.original.title} 
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            key={service.updated_at}
                        />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-bold text-slate-900 font-satoshi text-sm truncate max-w-[350px] transition-colors duration-300 group-hover:text-arcipta-blue-primary">
                            {row.original.title}
                        </span>
                        <p className="text-slate-500 text-[11px] max-w-[500px] font-medium leading-relaxed">
                            {truncatedText}
                        </p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Date Created",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                    {date.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            );
        }
    },
    {
        id: "actions",
        header: () => <div className="pl-2 font-bold text-slate-900 font-outfit uppercase tracking-wider text-[11px]">Actions</div>,
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
                            <PlusCircle className="mr-2 h-4 w-4 text-emerald-500" /> Add New
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => onView(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                            <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onEdit(row.original)} className="rounded-lg py-2.5 cursor-pointer font-medium">
                            <Pencil className="mr-2 h-4 w-4 text-amber-500" /> Edit Service
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                            onClick={() => onDeleteSingle(row.original)} 
                            className="rounded-lg py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Service
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];