"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/testimonial/TestimonialColumns";
import { type Testimonial } from "@/constants/testimonials";
import { getTestimonials, saveTestimonials } from "@/utils/testimonial-storage";
import { ViewTestimonialModal } from "@/components/organisms/testimonial/ViewTestimonialModal";
import { TestimonialFormModal } from "@/components/organisms/testimonial/TestimonialFormModal"; 
import { TestimonialFilter } from "@/components/organisms/testimonial/TestimonialFilter";
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
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

    const refresh = React.useCallback(() => {
        const data = getTestimonials();
        setTestimonials(data);
    }, []);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    const filteredData = React.useMemo(() => {
        return testimonials.filter((item: any) => {
            const itemName = item?.client_name || "";
            const itemTitle = item?.client_title || "";
            const itemContent = item?.content || "";
            
            const matchesSearch = 
                itemName.toLowerCase().includes(globalFilter.toLowerCase()) || 
                itemTitle.toLowerCase().includes(globalFilter.toLowerCase()) ||
                itemContent.toLowerCase().includes(globalFilter.toLowerCase());
            
            const rawDate = item?.created_at || item?.id;
            const itemDate = rawDate ? new Date(rawDate) : new Date();
            itemDate.setHours(0, 0, 0, 0);

            let matchesDate = true;
            if (dateRange.start) {
                const start = new Date(dateRange.start);
                start.setHours(0, 0, 0, 0);
                if (itemDate < start) matchesDate = false;
            }
            if (dateRange.end) {
                const end = new Date(dateRange.end);
                end.setHours(0, 0, 0, 0);
                if (itemDate > end) matchesDate = false;
            }

            return matchesSearch && matchesDate;
        });
    }, [testimonials, globalFilter, dateRange]);

    const persist = (data: Testimonial[]) => {
        setTestimonials(data);
        saveTestimonials(data);
    };

    const handleReset = () => {
        setGlobalFilter("");
        setDateRange({ start: "", end: "" });
    };

    const notifySuccess = (msg: string) => {
        setSuccess(msg);
        refresh();
        setTimeout(() => setSuccess(null), 3000);
    };

    const notifyError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 4000);
    };

    const handleConfirmDelete = () => {
        const ids = new Set(rowsToDelete.map(r => r.id));
        const newData = testimonials.filter(r => !ids.has(r.id));
        persist(newData);
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("Testimonial record successfully deleted.");
    };

    return (
        <div className="w-full relative font-satoshi px-6 pb-10">
            {success && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4 duration-300">
                    <AlertSuccess2 message={success} onClose={() => setSuccess(null)} />
                </div>
            )}

            {error && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4 duration-300">
                    <AlertError2 message={error} onClose={() => setError(null)} />
                </div>
            )}

            <div className="mb-4 space-y-1 pt-4">
                <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">Testimonial Management</h2>
                <p className="text-sm text-muted-foreground tracking-tight">Manage and Organize Client Feedback Content</p>
            </div>

            <TestimonialFilter 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                dateRange={dateRange}
                onDateChange={(type: 'start' | 'end', val: string) => 
                    setDateRange((prev) => ({ ...prev, [type]: val }))
                }
                onReset={handleReset}
            />

            <div className="mt-4"> 
                <DataTable
                    data={filteredData}
                    columns={columns({
                        onCreate: () => setIsCreateOpen(true),
                        onView: (t) => setViewItem(t),
                        onEdit: (t) => setEditItem(t),
                        onDeleteSingle: (t) => { setRowsToDelete([t]); setIsDeleteOpen(true); },
                    })}
                    onAddNew={() => setIsCreateOpen(true)}
                    searchPlaceholder="Filter testimonials..."
                    enableGlobalSearch={false}
                />
            </div>

            <TestimonialFormModal
                open={isCreateOpen || !!editItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateOpen(false);
                        setEditItem(null);
                    }
                }}
                testimonial={editItem}
                onSave={(updated) => persist(testimonials.map(t => t.id === updated.id ? updated : t))}
                onSuccess={notifySuccess}
                onError={notifyError}
            />

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
                title="Hapus Testimonial"
                description={`Tindakan ini akan menghapus ${rowsToDelete.length} testimonial secara permanen dari database.`}
            />
        </div>
    );
}