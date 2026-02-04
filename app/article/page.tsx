"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/article/ArticleColumns";
import { ArticleFilter } from "@/components/organisms/article/ArticleFilter";
import { getArticles, saveArticles } from "@/utils/article-storage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArticleForm } from "@/components/organisms/article/ArticleForm";
import { ViewArticleModal } from "@/components/organisms/article/ViewArticleModal";
import { PreviewArticleModal } from "@/components/organisms/article/PreviewArticleModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function ArticlePage() {
    const [data, setData] = React.useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isViewOpen, setIsViewOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<any | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<any[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

    const [globalFilter, setGlobalFilter] = React.useState("");
    const [catFilter, setCatFilter] = React.useState("all");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    const loadData = React.useCallback(() => setData(getArticles()), []);
    React.useEffect(() => { loadData(); }, [loadData]);

    const filteredData = React.useMemo(() => {
        return data.filter((item: any) => {
            const matchesSearch = item.title.toLowerCase().includes(globalFilter.toLowerCase());
            const matchesCat = catFilter === "all" || item.category.includes(Number(catFilter));
            const matchesStatus = statusFilter === "all" || String(item.is_published) === statusFilter;
            const itemDate = new Date(item.created_at).setHours(0,0,0,0);
            const start = dateRange.start ? new Date(dateRange.start).getTime() : null;
            const end = dateRange.end ? new Date(dateRange.end).getTime() : null;
            const matchesDate = (!start || itemDate >= start) && (!end || itemDate <= end);
            return matchesSearch && matchesCat && matchesStatus && matchesDate;
        });
    }, [data, globalFilter, catFilter, statusFilter, dateRange]);

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

    return (
        <div className="w-full relative font-satoshi px-6 pb-10">
            {success && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4 duration-300">
                    <AlertSuccess2 message={success} onClose={() => setSuccess(null)} />
                </div>
            )}

            <div className="mb-4 space-y-1 pt-4">
                <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">Article Management</h2>
                <p className="text-sm text-muted-foreground">Manage and Organize Article Content</p>
            </div>

            <ArticleFilter 
                globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                catFilter={catFilter} onModuleChange={setCatFilter}
                statusFilter={statusFilter} onStatusChange={setStatusFilter}
                dateRange={dateRange}
                onDateChange={(t:any, v:any) => setDateRange(p => ({...p, [t]: v}))}
                onReset={() => { setGlobalFilter(""); setCatFilter("all"); setStatusFilter("all"); setDateRange({start:"", end:""}); }}
            />

            <div className="mt-4"> 
                <DataTable
                    data={filteredData}
                    columns={columns(
                        () => { setSelectedItem(null); setIsFormOpen(true); },
                        (a) => { setSelectedItem(a); setIsViewOpen(true); },
                        (a) => { setSelectedItem(a); setIsFormOpen(true); },
                        (a) => { setRowsToDelete([a]); setIsDeleteOpen(true); },
                        (a) => { setSelectedItem(a); setIsPreviewOpen(true); }
                    )}
                    onAddNew={() => { setSelectedItem(null); setIsFormOpen(true); }}
                    searchPlaceholder="Filter judul..."
                    enableGlobalSearch={false}
                />
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent 
                    className="fixed inset-0 z-[100] h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 border-none p-0 bg-white rounded-none duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                >
                    <VisuallyHidden.Root><DialogTitle>Article Editor</DialogTitle></VisuallyHidden.Root>
                    <ArticleForm 
                        mode={selectedItem ? "edit" : "create"} 
                        initialData={selectedItem || undefined}
                        onClose={handleFormClose}
                    />
                </DialogContent>
            </Dialog>

            {selectedItem && <ViewArticleModal article={selectedItem} open={isViewOpen} onOpenChange={setIsViewOpen} />}

            {selectedItem && (
                <PreviewArticleModal 
                    article={selectedItem} 
                    open={isPreviewOpen} 
                    onOpenChange={setIsPreviewOpen} 
                />
            )}
            
            <AlertDeleteConfirmation 
                open={isDeleteOpen} onOpenChange={setIsDeleteOpen} 
                onConfirm={() => {
                    const ids = new Set(rowsToDelete.map(r => r.id));
                    const newData = data.filter(r => !ids.has(r.id));
                    setData(newData); saveArticles(newData); setIsDeleteOpen(false);
                    setSuccess("Konten berhasil dihapus.");
                }}
                title="Hapus Artikel" description="Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan."
            />
        </div>
    );
}