"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/service/ServiceColumns";
import { type Service } from "@/constants/services";
import { getServices, saveServices } from "@/utils/service-storage";
import { CreateServiceModal } from "@/components/organisms/service/CreateServiceModal";

export default function ServicePage() {
    const [services, setServices] = React.useState<Service[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

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
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        const newData = services.filter((row) => !selectedIds.has(row.id));
        setServices(newData);
        saveServices(newData);
    };

    return (
        <div className="w-full">
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
        </div>
    );
}