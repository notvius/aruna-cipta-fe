"use client";

import * as React from "react";
import { type Gallery } from "@/constants/galleries";
import { getGalleries, saveGalleries } from "@/utils/gallery-storage";
import { GalleryCard } from "@/components/organisms/gallery/GalleryCard";
import { CreateGalleryModal } from "@/components/organisms/gallery/CreateGalleryModal";
import { EditGalleryModal } from "@/components/organisms/gallery/EditGalleryModal";
import { ViewGalleryModal } from "@/components/organisms/gallery/ViewGalleryModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

    const refresh = React.useCallback(() => setGalleries(getGalleries()), []);
    React.useEffect(() => refresh(), [refresh]);

    const persist = (data: Gallery[]) => {
        setGalleries(data);
        saveGalleries(data);
    };

    const notifySuccess = (msg: string) => {
        setSuccess(msg);
        refresh();
        setTimeout(() => setSuccess(null), 2000);
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
        notifySuccess(`Image ${!item.is_published ? "published" : "set to draft"}`);
    };

    const handleConfirmDelete = () => {
        const ids = new Set(rowsToDelete.map(r => r.id));
        persist(galleries.filter(r => !ids.has(r.id)));
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("Gallery item(s) deleted successfully");
    };

    return (
        <div className="w-full relative px-4 sm:px-10">
            {success && (
                <div className="fixed top-6 right-6 z-[200] pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="pointer-events-auto">
                        <AlertSuccess2 message={success} onClose={() => setSuccess(null)} />
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed top-6 right-6 z-[200] pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="pointer-events-auto">
                        <AlertError2 message={error} onClose={() => setError(null)} />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
                <Button 
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-arcipta-blue-primary rounded-xl h-10 px-5 shadow-lg shadow-blue-100"
                >
                    <Plus className="mr-1 h-5 w-5" /> Add New Image
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {galleries.map((item) => (
                    <GalleryCard 
                        key={item.id}
                        item={item}
                        onView={setViewItem}
                        onEdit={setEditItem}
                        onToggleStatus={handleToggleStatus}
                        onDelete={(i) => { setRowsToDelete([i]); setIsDeleteOpen(true); }}
                    />
                ))}
            </div>

            {galleries.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed rounded-3xl">
                    <p className="text-muted-foreground">No images in gallery. Upload your first photo.</p>
                </div>
            )}

            <CreateGalleryModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={() => notifySuccess("Image added to gallery!")}
                onError={notifyError}
            />

            {editItem && (
                <EditGalleryModal
                    open={!!editItem}
                    onOpenChange={(open) => !open && setEditItem(null)}
                    gallery={editItem}
                    onSave={(updated) => persist(galleries.map(g => g.id === updated.id ? updated : g))}
                    onSuccess={() => notifySuccess("Gallery updated successfully!")}
                    onError={notifyError}
                />
            )}

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
                title="Delete Gallery Image"
                description={`Are you sure you want to delete ${rowsToDelete.length} image(s)?`}
            />
        </div>
    );
}