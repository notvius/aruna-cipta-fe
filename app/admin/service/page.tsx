"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/service/ServiceColumns";
import { type Service } from "@/constants/services";
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

    const refresh = React.useCallback(async () => {
        const token = Cookies.get("token");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();
            const actualData = Array.isArray(result) ? result : result.data || [];
            setServices(actualData);
        } catch (err) {
            notifyError("Failed to fetch services from server");
        }
    }, []);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    const filteredData = React.useMemo(() => {
        return services.filter((item: Service) => {
            const matchesSearch = 
                item.title.toLowerCase().includes(globalFilter.toLowerCase()) || 
                item.content.replace(/<[^>]*>?/gm, '').toLowerCase().includes(globalFilter.toLowerCase());
            
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
    }, [services, globalFilter, dateRange]);

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

    const handleConfirmDelete = async () => {
        const token = Cookies.get("token");
        try {
            for (const item of rowsToDelete) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/${item.uuid}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
            }
            setIsDeleteOpen(false);
            setRowsToDelete([]);
            notifySuccess("Service record successfully deleted.");
        } catch (err) {
            notifyError("Failed to delete record");
        }
    };

    return (
        <div className="w-full relative font-jakarta px-6 pb-10">
            {success && <div className="fixed top-6 right-6 z-[200]"><AlertSuccess2 message={success} onClose={() => setSuccess(null)} /></div>}
            {error && <div className="fixed top-6 right-6 z-[200]"><AlertError2 message={error} onClose={() => setError(null)} /></div>}

            <div className="mb-4 space-y-1 pt-4">
                <h2 className="text-2xl font-bold tracking-tight font-outfit text-slate-900 uppercase">
                    Service Management
                </h2>
                <p className="text-sm text-muted-foreground tracking-tight">
                    Define and manage Arcipta's services
                </p>
            </div>

            <ServiceFilter 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                dateRange={dateRange}
                onDateChange={(type: 'start' | 'end', val: string) => setDateRange((prev) => ({ ...prev, [type]: val }))}
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
                />
            </div>

            <ServiceFormModal
                open={isCreateOpen || !!editItem}
                onOpenChange={(open) => { if (!open) { setIsCreateOpen(false); setEditItem(null); } }}
                service={editItem}
                onSuccess={notifySuccess}
                onError={notifyError} 
            />

            {viewItem && <ViewServiceModal open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)} service={viewItem} />}

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleConfirmDelete}
                title="Hapus Layanan"
                description={`Tindakan ini akan menghapus ${rowsToDelete.length} layanan secara permanen.`}
            />
        </div>
    );
}