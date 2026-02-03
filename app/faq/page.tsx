"use client";

import * as React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { type Faq } from "@/constants/faqs";
import { getFaqs, saveFaqs } from "@/utils/faq-storage";
import { FaqAdminItem } from "@/components/organisms/faq/FaqAdminItem";
import { CreateFaqModal } from "@/components/organisms/faq/CreateFaqModal";
import { EditFaqModal } from "@/components/organisms/faq/EditFaqModal";
import { ViewFaqModal } from "@/components/organisms/faq/ViewFaqModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function FAQPage() {
    const [faqs, setFaqs] = React.useState<Faq[]>([]);
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);
    const [enabled, setEnabled] = React.useState(false);
    
    // State konsisten dengan Testimonial
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [viewItem, setViewItem] = React.useState<Faq | null>(null);
    const [editItem, setEditItem] = React.useState<Faq | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Faq[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const refresh = React.useCallback(() => setFaqs(getFaqs()), []);

    React.useEffect(() => {
        refresh();
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, [refresh]);

    const persist = (data: Faq[]) => {
        setFaqs(data);
        saveFaqs(data);
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

    const handleConfirmDelete = () => {
        const ids = new Set(rowsToDelete.map(r => r.id));
        persist(faqs.filter(r => !ids.has(r.id)));
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("FAQ(s) deleted successfully");
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(faqs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        persist(items);
    };

    if (!enabled) return null;

    return (
        <div className="w-full relative px-4 sm:px-10">
            {/* Alert Notifications - Konsisten dengan Testimonial */}
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
                <h2 className="text-2xl font-bold tracking-tight">FAQ Management</h2>
            </div>

            {/* Accordion with Drag & Drop */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="faq-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col border-t border-border">
                            {faqs.map((faq, index) => (
                                <Draggable key={faq.id.toString()} draggableId={faq.id.toString()} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps}>
                                            <FaqAdminItem 
                                                faq={faq} 
                                                isOpen={openIndex === index}
                                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                                                onCreate={() => setIsCreateOpen(true)}
                                                onView={(f) => setViewItem(f)}
                                                onEdit={(f) => setEditItem(f)}
                                                onDelete={(f) => { setRowsToDelete([f]); setIsDeleteOpen(true); }}
                                                dragHandleProps={provided.dragHandleProps}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Modals - Konsisten dengan Testimonial */}
            <CreateFaqModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={() => notifySuccess("FAQ added successfully!")}
                onError={notifyError}
            />

            {editItem && (
                <EditFaqModal
                    open={!!editItem}
                    onOpenChange={(open) => !open && setEditItem(null)}
                    faq={editItem}
                    onSave={(updated) => persist(faqs.map(f => f.id === updated.id ? updated : f))}
                    onSuccess={() => notifySuccess("FAQ updated successfully!")}
                    onError={notifyError}
                />
            )}

            {viewItem && (
                <ViewFaqModal
                    open={!!viewItem}
                    onOpenChange={(open) => !open && setViewItem(null)}
                    faq={viewItem}
                />
            )}

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleConfirmDelete}
                title="Delete FAQ"
                description={`Are you sure you want to delete ${rowsToDelete.length} FAQ(s)?`}
            />
        </div>
    );
}