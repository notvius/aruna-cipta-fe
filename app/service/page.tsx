"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { getServiceColumns } from "@/components/organisms/service/ServiceColumns";
import { type Service } from "@/constants/services";
import { getServices, saveServices } from "@/utils/service-storage";
import { ServiceFormModal } from "@/components/organisms/service/ServiceFormModal";
import { ViewServiceModal } from "@/components/organisms/service/ViewServiceModal";
import { ServiceFilter } from "@/components/organisms/service/ServiceFilter"; 
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function ServicePage() {
    const [services, setServices] = React.useState<Service[]>([]);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [viewItem, setViewItem] = React.useState<Service | null>(null);
    const [editItem, setEditItem] = React.useState<Service | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Service[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const [globalFilter, setGlobalFilter] = React.useState("");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

    const refresh = React.useCallback(() => {
        const data = getServices();
        setServices(data);
    }, []);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    const filteredData = React.useMemo(() => {
        return services.filter((item: Service) => {
            const matchesSearch = 
                item.title.toLowerCase().includes(globalFilter.toLowerCase()) || 
                item.content.replace(/<[^>]*>?/gm, '').toLowerCase().includes(globalFilter.toLowerCase());
            
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
    }, [services, globalFilter, dateRange]);

    const persist = (data: Service[]) => {
        setServices(data);
        saveServices(data);
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
        const newData = services.filter(r => !ids.has(r.id));
        persist(newData);
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("Service record successfully deleted.");
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
                <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">
                    Service Management
                </h2>
                <p className="text-sm text-muted-foreground tracking-tight">
                    Define and manage your business service offerings
                </p>
            </div>

            <ServiceFilter 
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
                    columns={getServiceColumns(
                        (s) => setViewItem(s),
                        (s) => setEditItem(s),
                        (s) => { setRowsToDelete([s]); setIsDeleteOpen(true); },
                        () => setIsCreateOpen(true)
                    )}
                    onAddNew={() => setIsCreateOpen(true)}
                    enableGlobalSearch={false}
                />
            </div>

            <ServiceFormModal
                open={isCreateOpen || !!editItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateOpen(false);
                        setEditItem(null);
                    }
                }}
                service={editItem}
                onSave={(updated) => persist(services.map(s => s.id === updated.id ? updated : s))}
                onSuccess={(msg) => notifySuccess(msg)} 
                onError={(msg) => notifyError(msg)}     
            />

            {viewItem && (
                <ViewServiceModal
                    open={!!viewItem}
                    onOpenChange={(open) => !open && setViewItem(null)}
                    service={viewItem}
                />
            )}

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleConfirmDelete}
                title="Hapus Layanan"
                description={`Tindakan ini akan menghapus ${rowsToDelete.length} layanan secara permanen dari database.`}
            />
        </div>
    );
}