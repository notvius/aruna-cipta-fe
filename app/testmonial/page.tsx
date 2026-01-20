"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/testimonial/TestimonialColumns";
import { type Testimonial } from "@/constants/testimonials";
import { getTestimonials, saveTestimonials } from "@/utils/testimonial-storage";
import { CreateTestimonialModal } from "@/components/organisms/testimonial/CreateTestimonialModal";

export default function TestimonialPage() {
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

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
        { label: "Created At", value: "createdAt" },
        { label: "Updated At", value: "updatedAt" },
    ];

    const handleDeleteSelected = (selectedRows: Testimonial[]) => {
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        const newData = testimonials.filter((row) => !selectedIds.has(row.id));
        setTestimonials(newData);
        saveTestimonials(newData);
    };

    return (
        <div className="w-full">
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
        </div>
    );
}