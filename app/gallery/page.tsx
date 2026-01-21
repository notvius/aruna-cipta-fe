"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/gallery/GalleryColumns";
import { type Gallery } from "@/constants/galleries";
import { getGalleries, saveGalleries } from "@/utils/gallery-storage";
import { CreateGalleryModal } from "@/components/organisms/gallery/CreateGalleryModal";

export default function GalleryPage() {
    const [galleries, setGalleries] = React.useState<Gallery[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const refreshGalleries = React.useCallback(() => {
        setGalleries(getGalleries());
    }, []);

    React.useEffect(() => {
        refreshGalleries();
    }, [refreshGalleries]);

    const handleDataChange = (newData: Gallery[]) => {
        setGalleries(newData);
        saveGalleries(newData);
    };

    const sortOptions = [
        { label: "Created At", value: "createdAt" },
        { label: "Updated At", value: "updatedAt" },
    ];

    const handleDeleteSelected = (selectedRows: Gallery[]) => {
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        const newData = galleries.filter((row) => !selectedIds.has(row.id));
        setGalleries(newData);
        saveGalleries(newData);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
            </div>

            <DataTable
                data={galleries}
                columns={columns}
                onDataChange={handleDataChange}
                sortOptions={sortOptions}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => setIsCreateModalOpen(true)}
            />

            <CreateGalleryModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={refreshGalleries}
            />
        </div>
    );
}