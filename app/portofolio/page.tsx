"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { getPortofolioColumns } from "@/components/organisms/portofolio/PortofolioColumns";
import { type Portofolio } from "@/constants/portofolios";
import { getPortofolios, savePortofolios } from "@/utils/portofolio-storage";
import { CreatePortofolioModal } from "@/components/organisms/portofolio/CreatePortofolioModal";
import { servicesData } from "@/data/services";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";

export default function PortofolioPage() {
    const [portofolios, setPortofolios] = React.useState<Portofolio[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Portofolio[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

    const columns = React.useMemo(
        () => getPortofolioColumns(servicesData),
        [servicesData]
    );

    const refreshPortofolios = React.useCallback(() => {
        setPortofolios(getPortofolios());
    }, []);

    React.useEffect(() => {
        refreshPortofolios();
    }, [refreshPortofolios]);

    const sortOptions = [
        { label: "Created At", value: "created_at" },
        { label: "Updated At", value: "updated_at" },
    ];

    const handleDeleteSelected = (selectedRows: Portofolio[]) => {
        setRowsToDelete(selectedRows);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const selectedIds = new Set(rowsToDelete.map((row) => row.id));
        const newData = portofolios.filter((row) => !selectedIds.has(row.id));
        setPortofolios(newData);
        savePortofolios(newData);
        setIsDeleteDialogOpen(false);
        setRowsToDelete([]);
        setSuccess("Portofolio(s) deleted successfully");
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="w-full">
            {success && <AlertSuccess2 message={success} />}

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Portofolio Management</h2>
            </div>

            <DataTable
                data={portofolios}
                columns={columns}
                sortOptions={sortOptions}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => setIsCreateModalOpen(true)}
                onDataChange={savePortofolios}
            />

            <CreatePortofolioModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={refreshPortofolios}
            />

            <AlertDeleteConfirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Portofolio"
                description={`Are you sure you want to delete ${rowsToDelete.length} portofolio(s)?`}
            />
        </div>
    );
}