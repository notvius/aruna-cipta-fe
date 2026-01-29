"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/gallery/GalleryColumns";
import { type Gallery } from "@/constants/galleries";
import { getGalleries, saveGalleries } from "@/utils/gallery-storage";
import { CreateGalleryModal } from "@/components/organisms/gallery/CreateGalleryModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";

export default function GalleryPage() {
    const [galleries, setGalleries] = React.useState<Gallery[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Gallery[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

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
        { label: "Created At", value: "created_at" },
        { label: "Updated At", value: "updated_at" },
    ];

    const handleDeleteSelected = (selectedRows: Gallery[]) => {
        setRowsToDelete(selectedRows);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const selectedIds = new Set(rowsToDelete.map((row) => row.id));
        const newData = galleries.filter((row) => !selectedIds.has(row.id));
        setGalleries(newData);
        saveGalleries(newData);
        setIsDeleteDialogOpen(false);
        setRowsToDelete([]);
        setSuccess("Gallery(s) deleted successfully");
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="w-full">
            {success && <AlertSuccess2 message={success} />}

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

            <AlertDeleteConfirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Gallery"
                description={`Are you sure you want to delete ${rowsToDelete.length} gallery(s)?`}
            />
        </div>
    );
}