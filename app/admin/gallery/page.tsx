"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { type Gallery } from "@/constants/galleries";
import { GalleryCard } from "@/components/organisms/gallery/GalleryCard";
import { GalleryFormModal } from "@/components/organisms/gallery/GalleryFormModal";
import { ViewGalleryModal } from "@/components/organisms/gallery/ViewGalleryModal";
import { GalleryFilter } from "@/components/organisms/gallery/GalleryFilter";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import { ImageIcon } from "lucide-react";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function GalleryPage() {
    const [galleries, setGalleries] = React.useState<Gallery[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [viewItem, setViewItem] = React.useState<Gallery | null>(null);
    const [editItem, setEditItem] = React.useState<Gallery | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Gallery[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();
            const actualData = Array.isArray(result) ? result : result.data || [];
            setGalleries(actualData);
        } catch (err) {
            notifyError("Failed to fetch gallery data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    const filteredData = React.useMemo(() => {
        return galleries.filter((item: Gallery) => {
            const searchStr = ((item.caption || "") + (item.alt_text || "")).toLowerCase();
            const matchesSearch = searchStr.includes(globalFilter.toLowerCase());
            let matchesStatus = true;
            const filterVal = statusFilter?.toLowerCase();
            if (filterVal === "published") {
                matchesStatus = item.is_published === true || String(item.is_published) === "1";
            } else if (filterVal === "draft") {
                matchesStatus = item.is_published === false || String(item.is_published) === "0";
            } else {
                matchesStatus = true;
            }
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
            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [galleries, globalFilter, statusFilter, dateRange]);

    const handleReset = () => {
        setGlobalFilter("");
        setStatusFilter("all");
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

    const handleToggleStatus = async (item: Gallery) => {
        const token = Cookies.get("token");
        const newStatus = item.is_published ? "0" : "1";
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("is_published", newStatus);
        formData.append("caption", item.caption || "");
        formData.append("alt_text", item.alt_text || "");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${item.uuid}`, {
                method: "POST",
                headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` },
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update status");
            notifySuccess(`Asset status changed to ${newStatus === "1" ? "Published" : "Draft"}`);
        } catch (err: any) {
            notifyError(err.message || "An error occurred while updating status");
        }
    };

    const handleConfirmDelete = async () => {
        const token = Cookies.get("token");
        try {
            for (const item of rowsToDelete) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${item.uuid}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
            }
            setIsDeleteOpen(false);
            setRowsToDelete([]);
            notifySuccess("Gallery asset deleted successfully");
        } catch (err) {
            notifyError("Failed to delete assets");
        }
    };

    return (
        <div className="w-full relative font-jakarta px-6 pb-10">
            {success && <div className="fixed top-6 right-6 z-[200]"><AlertSuccess2 message={success} onClose={() => setSuccess(null)} /></div>}
            {error && <div className="fixed top-6 right-6 z-[200]"><AlertError2 message={error} onClose={() => setError(null)} /></div>}

            <div className="mb-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-outfit text-slate-900 uppercase">Gallery Management</h2>
                    <p className="text-sm text-muted-foreground">Organize and filtering your visual media assets</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="h-10 px-6 bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 text-white rounded-lg shadow-sm transition-all active:scale-95 font-satoshi font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <span className="text-lg leading-none">+</span> Create New
                </button>
            </div>

            <GalleryFilter 
                globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                statusFilter={statusFilter} onStatusChange={setStatusFilter}
                dateRange={dateRange} onDateChange={(type: 'start' | 'end', val: string) => setDateRange((prev) => ({ ...prev, [type]: val }))}
                onReset={handleReset}
            />

            <div className="mt-10 min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arcipta-blue-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredData.map((item, index) => (
                                <GalleryCard 
                                    key={item.uuid || item.id || `gallery-${index}`}
                                    item={item}
                                    onAdd={() => setIsCreateOpen(true)}
                                    onView={setViewItem}
                                    onEdit={setEditItem}
                                    onToggleStatus={handleToggleStatus}
                                    onDelete={(i) => { setRowsToDelete([i]); setIsDeleteOpen(true); }}
                                />
                            ))}
                        </div>
                        {filteredData.length === 0 && (
                            <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 bg-slate-50/30">
                                <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100">
                                    <ImageIcon className="h-10 w-10 text-slate-300" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-900 font-bold uppercase tracking-widest text-xs">No media assets found</p>
                                    <p className="text-slate-400 text-sm">Use card menu to add or adjust your filters.</p>
                                </div>
                                <button onClick={() => setIsCreateOpen(true)} className="mt-2 text-arcipta-blue-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">+ Add First Media Asset</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <GalleryFormModal
                open={isCreateOpen || !!editItem}
                onOpenChange={(open) => { if (!open) { setIsCreateOpen(false); setEditItem(null); } }}
                gallery={editItem}
                onSuccess={notifySuccess}
                onError={notifyError}
            />
            {viewItem && <ViewGalleryModal open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)} gallery={viewItem} />}
            <AlertDeleteConfirmation open={isDeleteOpen} onOpenChange={setIsDeleteOpen} onConfirm={handleConfirmDelete} title="Hapus Media" description={`Tindakan ini akan menghapus ${rowsToDelete.length} item media secara permanen.`} />
        </div>
    );
}