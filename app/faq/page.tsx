"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/faq/FaqColumns";
import { type Faq } from "@/constants/faqs";
import { getFaqs, saveFaqs } from "@/utils/faq-storage";
import { CreateFaqModal } from "@/components/organisms/faq/CreateFaqModal";

export default function FAQPage() {
    const [faqs, setFaqs] = React.useState<Faq[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const refreshFaqs = React.useCallback(() => {
        setFaqs(getFaqs());
    }, []);

    React.useEffect(() => {
        refreshFaqs();
    }, [refreshFaqs]);

    const handleDataChange = (newData: Faq[]) => {
        setFaqs(newData);
        saveFaqs(newData);
    };

    const sortOptions = [
        { label: "Created At", value: "createdAt" },
        { label: "Updated At", value: "updatedAt" },
    ];

    const handleDeleteSelected = (selectedRows: Faq[]) => {
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        const newData = faqs.filter((row) => !selectedIds.has(row.id));
        setFaqs(newData);
        saveFaqs(newData);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">FAQ Management</h2>
            </div>

            <DataTable
                data={faqs}
                columns={columns}
                onDataChange={handleDataChange}
                sortOptions={sortOptions}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => setIsCreateModalOpen(true)}
            />

            <CreateFaqModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={refreshFaqs}
            />
        </div>
    );
}