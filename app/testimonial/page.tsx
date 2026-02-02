"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/testimonial/TestimonialColumns";
import { type Testimonial } from "@/constants/testimonials";
import { getTestimonials, saveTestimonials } from "@/utils/testimonial-storage";
import { CreateTestimonialModal } from "@/components/organisms/testimonial/CreateTestimonialModal";
import { EditTestimonialModal } from "@/components/organisms/testimonial/EditTestimonialModal";
import { ViewTestimonialModal } from "@/components/organisms/testimonial/ViewTestimonialModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function TestimonialPage() {
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [viewItem, setViewItem] = React.useState<Testimonial | null>(null);
    const [editItem, setEditItem] = React.useState<Testimonial | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Testimonial[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const refresh = React.useCallback(() => setTestimonials(getTestimonials()), []);

    React.useEffect(() => refresh(), [refresh]);

    const persist = (data: Testimonial[]) => {
        setTestimonials(data);
        saveTestimonials(data);
    };

    const notifySuccess = (msg: string) => {
        setSuccess(msg);
        refresh();
        setTimeout(() => setSuccess(null), 2000);
    };

    const notifyError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 4000);
    };

    const handleConfirmDelete = () => {
        const ids = new Set(rowsToDelete.map(r => r.id));
        persist(testimonials.filter(r => !ids.has(r.id)));
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("Testimonial(s) deleted successfully");
    };

    return (
        <div className="w-full relative">
            {success && (
                <div className="fixed top-6 right-6 z-[200] pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="pointer-events-auto">
                        <AlertSuccess2 message={success} onClose={() => setSuccess(null)} />
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed top-6 right-6 z-[200] pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="pointer-events-auto">
                        <AlertError2 message={error} onClose={() => setError(null)} />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Testimonial Management</h2>
            </div>

            <DataTable
                data={testimonials}
                columns={columns({
                    onCreate: () => setIsCreateOpen(true),
                    onView: (t) => setViewItem(t),
                    onEdit: (t) => setEditItem(t),
                    onDeleteSingle: (t) => { setRowsToDelete([t]); setIsDeleteOpen(true); },
                })}
                onDataChange={persist}
                onDeleteSelected={(rows) => { setRowsToDelete(rows); setIsDeleteOpen(true); }}
            />

            <CreateTestimonialModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={() => notifySuccess("Testimonial added successfully!")}
                onError={notifyError}
            >
                <span />
            </CreateTestimonialModal>

            {editItem && (
                <EditTestimonialModal
                    open={!!editItem}
                    onOpenChange={(open) => !open && setEditItem(null)}
                    testimonial={editItem}
                    onSave={(updated) => persist(testimonials.map(t => t.id === updated.id ? updated : t))}
                    onSuccess={() => notifySuccess("Testimonial updated successfully!")}
                    onError={notifyError}
                />
            )}

            {viewItem && (
                <ViewTestimonialModal
                    open={!!viewItem}
                    onOpenChange={(open) => !open && setViewItem(null)}
                    testimonial={viewItem}
                />
            )}

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Testimonial"
                description={`Are you sure you want to delete ${rowsToDelete.length} testimonial(s)?`}
            />
        </div>
    );
}