"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/testimonial/TestimonialColumns";
import { type Testimonial } from "@/constants/testimonials";
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

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonial`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();
            setTestimonials(Array.isArray(result) ? result : result.data || []);
        } catch (err) {
            notifyError("Failed to fetch data from server");
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    const filteredData = React.useMemo(() => {
        return testimonials.filter((item: any) => {
            const matchesSearch =
                item.client_name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
                item.client_title?.toLowerCase().includes(globalFilter.toLowerCase()) ||
                item.content?.toLowerCase().includes(globalFilter.toLowerCase());

            const itemDate = new Date(item.created_at);
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

    const handleResetFilters = () => {
        setGlobalFilter("");
        setDateRange({ start: "", end: "" });
    };

    const notifySuccess = (msg: string) => {
        setSuccess(msg);
        refreshData();
        setTimeout(() => setSuccess(null), 3000);
    };

    const notifyError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 4000);
    };

    const handleConfirmDelete = async () => {
        const token = Cookies.get("token");
        try {
            for (const item of rowsToDelete) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonial/${item.uuid}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
            }
            setIsDeleteOpen(false);
            setRowsToDelete([]);
            notifySuccess("Data successfully deleted");
        } catch (err) {
            notifyError("Failed to delete record");
        }
    };

    return (
        <div className="w-full relative font-jakarta px-6 pb-10">
            {success && (
                <div className="fixed top-6 right-6 z-[200]">
                    <AlertSuccess2
                        message={success}
                        onClose={() => setSuccess(null)}
                    />
                </div>
            )}
            {error && (
                <div className="fixed top-6 right-6 z-[200]">
                    <AlertError2
                        message={error}
                        onClose={() => setError(null)}
                    />
                </div>
            )}

            <div className="mb-4 space-y-1 pt-4">
                <h2 className="text-2xl font-bold font-outfit text-slate-900 uppercase">
                    Testimonial Management
                </h2>
                <p className="text-sm text-muted-foreground">
                    Manage and Organize Client Feedback Content
                </p>
            </div>

            <TestimonialFilter
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                dateRange={dateRange}
                onDateChange={(type: 'start' | 'end', val: string) =>
                    setDateRange((prev) => ({ ...prev, [type]: val }))
                }
                onReset={handleResetFilters}
            />

            <div className="mt-4">
                <DataTable
                    data={filteredData}
                    columns={columns({
                        onCreate: () => setIsCreateOpen(true),
                        onView: (t) => setViewItem(t),
                        onEdit: (t) => setEditItem(t),
                        onDeleteSingle: (t) => {
                            setRowsToDelete([t]);
                            setIsDeleteOpen(true);
                        },
                    })}
                    onAddNew={() => setIsCreateOpen(true)}
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
                title="Delete Testimonial"
                description={`Permanently delete ${rowsToDelete.length} record(s)?`}
            />
        </div>
    );
}
