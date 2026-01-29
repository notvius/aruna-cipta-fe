"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/testimonial/TestimonialColumns";
import { type Testimonial } from "@/constants/testimonials";
import { getTestimonials, saveTestimonials } from "@/utils/testimonial-storage";
import { CreateTestimonialModal } from "@/components/organisms/testimonial/CreateTestimonialModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";

export default function TestimonialPage() {
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Testimonial[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

    const refreshTestimonials = React.useCallback(() => {
        setTestimonials(getTestimonials());
    }, []);

    React.useEffect(() => {
        refreshTestimonials();
    }, [refreshTestimonials]);

    const handleDataChange = (newData: Testimonial[]) => {
        setTestimonials(newData);
        saveTestimonials(newData);
    };

    const sortOptions = [
        { label: "Created At", value: "created_at" },
        { label: "Updated At", value: "updated_at" },
    ];

    const handleDeleteSelected = (selectedRows: Testimonial[]) => {
        setRowsToDelete(selectedRows);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const selectedIds = new Set(rowsToDelete.map((row) => row.id));
        const newData = testimonials.filter((row) => !selectedIds.has(row.id));
        setTestimonials(newData);
        saveTestimonials(newData);
        setIsDeleteDialogOpen(false);
        setRowsToDelete([]);
        setSuccess("Testimonial(s) deleted successfully");
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="w-full">
            {success && <AlertSuccess2 message={success} />}

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Testimonial Management</h2>
            </div>

            <DataTable
                data={testimonials}
                columns={columns}
                onDataChange={handleDataChange}
                sortOptions={sortOptions}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => setIsCreateModalOpen(true)}
            />

            <CreateTestimonialModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={refreshTestimonials}
            />

            <AlertDeleteConfirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Testimonial"
                description={`Are you sure you want to delete ${rowsToDelete.length} testimonial(s)?`}
            />
        </div>
    );
}