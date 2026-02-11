"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { type Faq } from "@/constants/faqs";
import { FaqAdminItem } from "@/components/organisms/faq/FaqAdminItem";
import { FaqFormModal } from "@/components/organisms/faq/FaqFormModal";
import { ViewFaqModal } from "@/components/organisms/faq/ViewFaqModal";
import { FaqFilter } from "@/components/organisms/faq/FaqFilter";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function FAQPage() {
    const [faqs, setFaqs] = React.useState<Faq[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [enabled, setEnabled] = React.useState(false);
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [viewItem, setViewItem] = React.useState<Faq | null>(null);
    const [editItem, setEditItem] = React.useState<Faq | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Faq[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();
            const actualData = Array.isArray(result) ? result : result.data || [];
            setFaqs(actualData);
        } catch (err) {
            notifyError("Failed to fetch data from server");
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, [refreshData]);

    const filteredData = React.useMemo(() => {
        return faqs.filter((item: Faq) => {
            const matchesSearch =
                item.question.toLowerCase().includes(globalFilter.toLowerCase()) ||
                item.answer.toLowerCase().includes(globalFilter.toLowerCase());
            if (!dateRange.start && !dateRange.end) return matchesSearch;
            const itemDate = new Date(item.created_at);
            if (isNaN(itemDate.getTime())) return matchesSearch;
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

    const handleResetFilters = () => {
        setGlobalFilter("");
        setDateRange({ start: "", end: "" });
    };

    const notifySuccess = (msg: string) => {
        setSuccess(msg);
        refreshData();
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
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/${item.uuid}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
            }
            setIsDeleteOpen(false);
            setRowsToDelete([]);
            notifySuccess("FAQ record successfully deleted.");
        } catch (err) {
            notifyError("Failed to delete record");
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(faqs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFaqs(items);
    };

    if (!enabled) return null;

    return (
        <div className="w-full relative font-jakarta px-6 pb-10">
            {success && <div className="fixed top-6 right-6 z-[200]"><AlertSuccess2 message={success} onClose={() => setSuccess(null)} /></div>}
            {error && <div className="fixed top-6 right-6 z-[200]"><AlertError2 message={error} onClose={() => setError(null)} /></div>}

            <div className="mb-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-outfit text-slate-900 uppercase">FAQ Management</h2>
                    <p className="text-sm text-muted-foreground">Manage and Organize Frequently Asked Questions</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="h-10 px-6 bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 text-white rounded-lg shadow-sm transition-all active:scale-95 font-satoshi font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <span className="text-lg leading-none">+</span> Create New
                </button>
            </div>

            <FaqFilter
                globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                dateRange={dateRange} onDateChange={(type: 'start' | 'end', val: string) => setDateRange((prev) => ({ ...prev, [type]: val }))}
                onReset={handleResetFilters}
            />

            <div className="mt-10 min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arcipta-blue-primary"></div>
                    </div>
                ) : (
                    <>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="faq-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col border-t border-slate-200">
                                        {filteredData.map((faq, index) => (
                                            <Draggable key={faq.uuid} draggableId={faq.uuid} index={index}>
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
                    </>
                )}
            </div>

            <FaqFormModal
                open={isCreateOpen || !!editItem}
                onOpenChange={(open) => { if (!open) { setIsCreateOpen(false); setEditItem(null); } }}
                faq={editItem}
                onSuccess={notifySuccess}
                onError={notifyError}
            />

            {viewItem && <ViewFaqModal open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)} faq={viewItem} />}

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleConfirmDelete}
                title="Hapus FAQ"
                description={`Tindakan ini akan menghapus ${rowsToDelete.length} pertanyaan secara permanen.`}
            />
        </div>
    );
}