"use client";

import * as React from "react";
import { type Gallery } from "@/constants/galleries";
import { getGalleries, saveGalleries } from "@/utils/gallery-storage";
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
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [viewItem, setViewItem] = React.useState<Gallery | null>(null);
    const [editItem, setEditItem] = React.useState<Gallery | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Gallery[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    // Filter States
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

    const refresh = React.useCallback(() => setGalleries(getGalleries()), []);
    React.useEffect(() => refresh(), [refresh]);

    const filteredData = React.useMemo(() => {
        return galleries.filter((item: Gallery) => {
            const matchesSearch = 
                item.caption.toLowerCase().includes(globalFilter.toLowerCase()) || 
                item.alt_text.toLowerCase().includes(globalFilter.toLowerCase());
            
            let matchesStatus = true;
            if (statusFilter === "published") matchesStatus = item.is_published === true;
            if (statusFilter === "draft") matchesStatus = item.is_published === false;

            const rawDate = item?.created_at || new Date();
            const itemDate = new Date(rawDate);
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

    const persist = (data: Gallery[]) => {
        setGalleries(data);
        saveGalleries(data);
    };

    const handleReset = () => {
        setGlobalFilter("");
        setStatusFilter("all");
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

    const handleToggleStatus = (item: Gallery) => {
        const newData = galleries.map(g => 
            g.id === item.id ? { ...g, is_published: !g.is_published, updated_at: new Date() } : g
        );
        persist(newData);
        notifySuccess(`Image status updated to ${!item.is_published ? "Published" : "Draft"}`);
    };

    const handleConfirmDelete = () => {
        const ids = new Set(rowsToDelete.map(r => r.id));
        const newData = galleries.filter(r => !ids.has(r.id));
        persist(newData);
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("Gallery asset deleted successfully");
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

            <div className="mb-8 pt-4 space-y-1">
                <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">
                    Gallery Management
                </h2>
                <p className="text-sm text-muted-foreground tracking-tight">
                    Organize and filtering your visual media assets
                </p>
            </div>

            <GalleryFilter 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                dateRange={dateRange}
                onDateChange={(type: 'start' | 'end', val: string) => 
                    setDateRange((prev) => ({ ...prev, [type]: val }))
                }
                onReset={handleReset}
            />

            <div className="mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((item) => (
                        <GalleryCard 
                            key={item.id}
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
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-2 text-arcipta-blue-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                        >
                            + Add First Media Asset
                        </button>
                    </div>
                )}
            </div>

            <GalleryFormModal
                open={isCreateOpen || !!editItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateOpen(false);
                        setEditItem(null);
                    }
                }}
                gallery={editItem}
                onSave={(updated) => persist(galleries.map(g => g.id === updated.id ? updated : g))}
                onSuccess={notifySuccess}
                onError={notifyError}
            />

            {viewItem && (
                <ViewGalleryModal
                    open={!!viewItem}
                    onOpenChange={(open) => !open && setViewItem(null)}
                    gallery={viewItem}
                />
            )}

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleConfirmDelete}
                title="Hapus Media"
                description={`Tindakan ini akan menghapus ${rowsToDelete.length} item media secara permanen.`}
            />
        </div>
    );
}