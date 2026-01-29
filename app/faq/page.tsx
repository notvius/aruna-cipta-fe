"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/faq/FaqColumns";
import { type Faq } from "@/constants/faqs";
import { getFaqs, saveFaqs } from "@/utils/faq-storage";
import { CreateFaqModal } from "@/components/organisms/faq/CreateFaqModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";

export default function FAQPage() {
    const [faqs, setFaqs] = React.useState<Faq[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Faq[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

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
        setRowsToDelete(selectedRows);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const selectedIds = new Set(rowsToDelete.map((row) => row.id));
        const newData = faqs.filter((row) => !selectedIds.has(row.id));
        setFaqs(newData);
        saveFaqs(newData);
        setIsDeleteDialogOpen(false);
        setRowsToDelete([]);
        setSuccess("FAQ(s) deleted successfully");
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="w-full">
            {success && <AlertSuccess2 message={success} />}

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

            <AlertDeleteConfirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete FAQ"
                description={`Are you sure you want to delete ${rowsToDelete.length} FAQ(s)?`}
            />
        </div>
    );
}