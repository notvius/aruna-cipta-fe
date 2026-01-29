"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/service/ServiceColumns";
import { type Service } from "@/constants/services";
import { getServices, saveServices } from "@/utils/service-storage";
import { CreateServiceModal } from "@/components/organisms/service/CreateServiceModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";

export default function ServicePage() {
    const [services, setServices] = React.useState<Service[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Service[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

    const refreshServices = React.useCallback(() => {
        setServices(getServices());
    }, []);

    React.useEffect(() => {
        refreshServices();
    }, [refreshServices]);

    const handleDataChange = (newData: Service[]) => {
        setServices(newData);
        saveServices(newData);
    };

    const sortOptions = [
        { label: "Created At", value: "created_at" },
        { label: "Updated At", value: "updated_at" },
    ];

    const handleDeleteSelected = (selectedRows: Service[]) => {
        setRowsToDelete(selectedRows);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const selectedIds = new Set(rowsToDelete.map((row) => row.id));
        const newData = services.filter((row) => !selectedIds.has(row.id));
        setServices(newData);
        saveServices(newData);
        setIsDeleteDialogOpen(false);
        setRowsToDelete([]);
        setSuccess("Service(s) deleted successfully");
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="w-full">
            {success && <AlertSuccess2 message={success} />}

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Service Management</h2>
            </div>

            <DataTable
                data={services}
                columns={columns}
                onDataChange={handleDataChange}
                sortOptions={sortOptions}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => setIsCreateModalOpen(true)}
            />

            <CreateServiceModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={refreshServices}
            />

            <AlertDeleteConfirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Service"
                description={`Are you sure you want to delete ${rowsToDelete.length} service(s)?`}
            />
        </div>
    );
}