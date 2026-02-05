"use client";

import * as React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { type Faq } from "@/constants/faqs";
import { getFaqs, saveFaqs } from "@/utils/faq-storage";
import { FaqAdminItem } from "@/components/organisms/faq/FaqAdminItem";
import { FaqFormModal } from "@/components/organisms/faq/FaqFormModal"; 
import { ViewFaqModal } from "@/components/organisms/faq/ViewFaqModal";
import { FaqFilter } from "@/components/organisms/faq/FaqFilter";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function FAQPage() {
    const [faqs, setFaqs] = React.useState<Faq[]>([]);
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);
    const [enabled, setEnabled] = React.useState(false);
    
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [viewItem, setViewItem] = React.useState<Faq | null>(null);
    const [editItem, setEditItem] = React.useState<Faq | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Faq[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    // Filter States
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

    const refresh = React.useCallback(() => setFaqs(getFaqs()), []);

    React.useEffect(() => {
        refresh();
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, [refresh]);

    const filteredData = React.useMemo(() => {
        return faqs.filter((item: Faq) => {
            const matchesSearch = 
                item.question.toLowerCase().includes(globalFilter.toLowerCase()) || 
                item.answer.toLowerCase().includes(globalFilter.toLowerCase());
            
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
    }, [faqs, globalFilter, dateRange]);

    const persist = (data: Faq[]) => {
        setFaqs(data);
        saveFaqs(data);
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
        const newData = faqs.filter(r => !ids.has(r.id));
        persist(newData);
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("FAQ record successfully deleted.");
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

            <div className="mb-8 space-y-1 pt-4">
                <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">
                    FAQ Management
                </h2>
                <p className="text-sm text-muted-foreground tracking-tight">
                    Manage and Reorder Frequently Asked Questions
                </p>
            </div>

            <FaqFilter 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                dateRange={dateRange}
                onDateChange={(type: 'start' | 'end', val: string) => 
                    setDateRange((prev) => ({ ...prev, [type]: val }))
                }
                onReset={handleReset}
            />

            <div className="mt-10">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="faq-list">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                className="flex flex-col border-t border-slate-200"
                            >
                                {filteredData.map((faq, index) => (
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
                
                {filteredData.length === 0 && (
                    <div className="py-20 text-center border-b border-slate-200">
                        <p className="text-slate-400 font-medium">No FAQ records found matching your filter.</p>
                    </div>
                )}
            </div>

            <FaqFormModal
                open={isCreateOpen || !!editItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateOpen(false);
                        setEditItem(null);
                    }
                }}
                faq={editItem}
                onSave={(updated) => persist(faqs.map(f => f.id === updated.id ? updated : f))}
                onSuccess={notifySuccess}
                onError={notifyError}
            />

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
                title="Hapus FAQ"
                description={`Tindakan ini akan menghapus ${rowsToDelete.length} pertanyaan secara permanen dari database.`}
            />
        </div>
    );
}