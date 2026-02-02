"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type Faq } from "@/constants/faqs";
import { EditFaqModal } from "./EditFaqModal";
import { ViewFaqModal } from "./ViewFaqModal";

const truncateWords = (text: string, count: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= count) return text;
    return words.slice(0, count).join(" ") + "...";
};

export const columns: ColumnDef<Faq>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
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
        size: 40, 
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "question",
        header: "Question",
        size: 180, 
        cell: ({ row }) => (
            <div className="text-sm font-medium whitespace-normal break-words w-[180px] pr-">
                {truncateWords(row.getValue("question"), 10)}
            </div>
        )
    },
    {
        accessorKey: "answer",
        header: "Answer",
        size: 300,
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground whitespace-normal break-words w-[300px] pr-4">
                {truncateWords(row.getValue("answer"), 10)}
            </div>
        )
    },
    {
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        id: "actions",
        header: "Action",
        size: 100,
        enableHiding: false,
        cell: ({ row, table }) => {
            const faq = row.original;
            return (
                <div className="flex items-center justify-start gap-1">
                    <ViewFaqModal faq={faq} />
                    <EditFaqModal
                        faq={faq}
                        onSave={(updatedFaq) => table.options.meta?.updateRow(row.index, updatedFaq)}
                    />
                </div>
            );
        },
    },
]