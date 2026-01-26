"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { getPortofolioColumns } from "@/components/organisms/portofolio/PortofolioColumns";
import { type Portofolio } from "@/constants/portofolios";
import { getPortofolios, savePortofolios } from "@/utils/portofolio-storage";
import { CreatePortofolioModal } from "@/components/organisms/portofolio/CreatePortofolioModal";
import { servicesData } from "@/data/services";

export default function PortofolioPage() {
    const [portofolios, setPortofolios] = React.useState<Portofolio[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
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
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        const newData = portofolios.filter((row) => !selectedIds.has(row.id));
        setPortofolios(newData);
        savePortofolios(newData);
    };

    return (
        <div className="w-full">
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
        </div>
    );
}