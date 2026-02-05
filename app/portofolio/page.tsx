"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/portofolio/PortofolioColumns";
import { getPortofolios, savePortofolios } from "@/utils/portofolio-storage";
import { getPortofolioContentById } from "@/utils/portofolio-content-storage"; 
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PortofolioForm } from "@/components/organisms/portofolio/PortofolioForm";
import { ViewPortofolioModal } from "@/components/organisms/portofolio/ViewPortofolioModal";
import { PreviewPortofolioModal } from "@/components/organisms/portofolio/PreviewPortofolioModal";
import { PortofolioFilter } from "@/components/organisms/portofolio/PortofolioFilter";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { type Portofolio } from "@/constants/portofolios";

export default function PortofolioPage() {
    const [data, setData] = React.useState<Portofolio[]>([]);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isViewOpen, setIsViewOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<Portofolio | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Portofolio[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

    // Filter & Preview States
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [catFilter, setCatFilter] = React.useState("all");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [previewContent, setPreviewContent] = React.useState<any>(null); 

    const loadData = React.useCallback(() => {
        setData(getPortofolios());
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredData = React.useMemo(() => {
        return data.filter((item: any) => {
            const matchesSearch = 
                item.title.toLowerCase().includes(globalFilter.toLowerCase()) || 
                item.client_name.toLowerCase().includes(globalFilter.toLowerCase());
            
            const matchesCat = catFilter === "all" || item.category.includes(Number(catFilter));

            const itemDate = new Date(item.created_at);
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

            return matchesSearch && matchesCat && matchesDate;
        });
    }, [data, globalFilter, catFilter, dateRange]);

    React.useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleFormClose = (message?: string) => {
        setIsFormOpen(false);
        setSelectedItem(null);
        loadData();
        if (message && typeof message === 'string') {
            setSuccess(message);
        }
    };

    const handleReset = () => {
        setGlobalFilter("");
        setCatFilter("all");
        setDateRange({ start: "", end: "" });
    };

    return (
        <div className="w-full relative font-satoshi px-6 pb-10">
            {success && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4 duration-300">
                    <AlertSuccess2 message={success} onClose={() => setSuccess(null)} />
                </div>
            )}

            <div className="mb-4 space-y-1 pt-4">
                <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">Portfolio Management</h2>
                <p className="text-sm text-muted-foreground tracking-tight">Manage and Organize Portfolio Content</p>
            </div>

            <PortofolioFilter 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                catFilter={catFilter}
                onCatChange={setCatFilter}
                dateRange={dateRange}
                onDateChange={(type: 'start' | 'end', val: string) => 
                    setDateRange((prev) => ({ ...prev, [type]: val }))
                }
                onReset={handleReset}
            />

            <div className="mt-4"> 
                <DataTable
                    data={filteredData}
                    columns={columns(
                        () => { setSelectedItem(null); setIsFormOpen(true); },
                        (p) => { setSelectedItem(p); setIsViewOpen(true); },
                        (p) => { setSelectedItem(p); setIsFormOpen(true); },
                        (p) => { setRowsToDelete([p]); setIsDeleteOpen(true); },
                        (p) => { 
                            const content = getPortofolioContentById(p.id);
                            setSelectedItem(p);
                            setPreviewContent(content || { 
                                context: "", challenge: "", approach: "", 
                                image_process: ["", ""], impact: "" 
                            });
                            setIsPreviewOpen(true); 
                        }
                    )}
                    onAddNew={() => { setSelectedItem(null); setIsFormOpen(true); }}
                    searchPlaceholder="Filter project..."
                    enableGlobalSearch={false}
                />
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent 
                    className="fixed inset-0 z-[150] h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 border-none p-0 bg-white rounded-none duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                >
                    <VisuallyHidden.Root><DialogTitle>Portfolio Editor</DialogTitle></VisuallyHidden.Root>
                    <PortofolioForm 
                        mode={selectedItem ? "edit" : "create"} 
                        initialData={selectedItem} 
                        onClose={handleFormClose} 
                    />
                </DialogContent>
            </Dialog>

            <ViewPortofolioModal 
                portofolio={selectedItem} 
                open={isViewOpen} 
                onOpenChange={setIsViewOpen} 
            />

            {selectedItem && (
                <PreviewPortofolioModal 
                    open={isPreviewOpen} 
                    onOpenChange={setIsPreviewOpen} 
                    data={selectedItem}
                    content={previewContent}
                />
            )}

            <AlertDeleteConfirmation 
                open={isDeleteOpen} onOpenChange={setIsDeleteOpen} 
                onConfirm={() => {
                    const ids = new Set(rowsToDelete.map(r => r.id));
                    const newData = data.filter(r => !ids.has(r.id));
                    setData(newData); savePortofolios(newData); setIsDeleteOpen(false);
                    setSuccess("Portfolio record successfully deleted.");
                }}
                title="Hapus Portfolio" 
                description="Tindakan ini akan menghapus case study secara permanen dari database."
            />
        </div>
    );
}