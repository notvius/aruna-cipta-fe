"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/article/ArticleColumns";
import { ArticleFilter } from "@/components/organisms/article/ArticleFilter";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArticleForm } from "@/components/organisms/article/ArticleForm";
import { ViewArticleModal } from "@/components/organisms/article/ViewArticleModal";
import { PreviewArticleModal } from "@/components/organisms/article/PreviewArticleModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { type Article, type ArticleCategory } from "@/constants/articles";

export default function ArticlePage() {
    const [data, setData] = React.useState<Article[]>([]);
    const [categories, setCategories] = React.useState<ArticleCategory[]>([]);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isViewOpen, setIsViewOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<Article | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Article[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const [globalFilter, setGlobalFilter] = React.useState("");
    const [catFilter, setCatFilter] = React.useState("all");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        try {
            const [artRes, catRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/article`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/article-category`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                })
            ]);
            const artJson = await artRes.json();
            const catJson = await catRes.json();
            setData(Array.isArray(artJson) ? artJson : (artJson.data || []));
            setCategories(Array.isArray(catJson) ? catJson : (catJson.data || []));
        } catch (err) {
            console.error("Failed to fetch articles");
        }
    }, []);

    React.useEffect(() => { refreshData(); }, [refreshData]);

    const filteredData = React.useMemo(() => {
        return data.filter((item) => {
            const title = item.title || "";
            const matchesSearch = title.toLowerCase().includes(globalFilter.toLowerCase());
            const matchesCat = catFilter === "all" || item.article_category_id?.toString() === catFilter;

            const rawDate = item.created_at || item.updated_at;
            const itemDate = rawDate ? new Date(rawDate).setHours(0, 0, 0, 0) : null;

            const start = dateRange.start ? new Date(dateRange.start).getTime() : null;
            const end = dateRange.end ? new Date(dateRange.end).getTime() : null;

            const matchesDate = !itemDate || (
                (!start || itemDate >= start) &&
                (!end || itemDate <= end)
            );

            return matchesSearch && matchesCat && matchesDate;
        });
    }, [data, globalFilter, catFilter, dateRange]);

    const handleToggleStatus = async (item: Article) => {
        const token = Cookies.get("token");
        const newStatus = item.is_published ? "0" : "1";
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("is_published", newStatus);
        formData.append("title", item.title);
        formData.append("excerpt", item.excerpt || "");
        formData.append("content", item.content || "");
        const getCatIdValue = (c: any): string => {
            if (Array.isArray(c)) return getCatIdValue(c[0]);
            if (c && typeof c === 'object') return (c.id || c.article_category_id || c.category_id || "").toString();
            return (c || "").toString();
        };

        const categoryId = item.article_category_id || getCatIdValue(item.category);
        formData.append("article_category_id", String(categoryId));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/${item.uuid}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
                body: formData
            });
            if (res.ok) {
                setSuccess(`Article visibility updated to ${newStatus === "1" ? "Published" : "Draft"}.`);
                refreshData();
                setTimeout(() => setSuccess(null), 3000);
            } else {
                const result = await res.json();
                throw new Error(result.message || "Failed to update article status");
            }
        } catch (err: any) {
            console.error("Status update failed:", err);
            setError(err.message || "An error occurred while updating status");
            setTimeout(() => setError(null), 4000);
        }
    };

    const handleFormClose = (message?: string) => {
        setIsFormOpen(false);
        setSelectedItem(null);
        refreshData();
        if (message) {
            setSuccess(message);
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const handleConfirmDelete = async () => {
        const token = Cookies.get("token");
        try {
            for (const item of rowsToDelete) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/${item.uuid}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
            }
            setIsDeleteOpen(false);
            setRowsToDelete([]);
            setSuccess("Article deleted successfully.");
            refreshData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Delete failed");
        }
    };

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

            <div className="mb-4 space-y-1 pt-4">
                <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">
                    Article Management
                </h2>
                <p className="text-sm text-muted-foreground">
                    Manage and Organize Article Content
                </p>
            </div>

            <ArticleFilter
                globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                catFilter={catFilter} onModuleChange={setCatFilter}
                dateRange={dateRange} onDateChange={(t: any, v: any) => setDateRange(p => ({ ...p, [t]: v }))}
                onReset={() => { setGlobalFilter(""); setCatFilter("all"); setDateRange({ start: "", end: "" }); }}
                categories={categories}
            />

            <div className="mt-4">
                <DataTable
                    data={filteredData}
                    columns={columns(
                        () => { setSelectedItem(null); setIsFormOpen(true); },
                        (a) => { setSelectedItem(a); setIsViewOpen(true); },
                        (a) => { setSelectedItem(a); setIsFormOpen(true); },
                        (a) => { setRowsToDelete([a]); setIsDeleteOpen(true); },
                        (a) => { setSelectedItem(a); setIsPreviewOpen(true); },
                        handleToggleStatus,
                        categories
                    )}
                    onAddNew={() => { setSelectedItem(null); setIsFormOpen(true); }}
                    enableGlobalSearch={false}
                />
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="fixed inset-0 z-[100] h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 border-none p-0 bg-white rounded-none">
                    <VisuallyHidden.Root><DialogTitle>Article Editor</DialogTitle></VisuallyHidden.Root>
                    <ArticleForm
                        mode={selectedItem ? "edit" : "create"}
                        initialData={selectedItem}
                        onClose={handleFormClose}
                        categories={categories}
                        onCategoryRefresh={refreshData}
                    />
                </DialogContent>
            </Dialog>

            <ViewArticleModal article={selectedItem} open={isViewOpen} onOpenChange={setIsViewOpen} categories={categories} />
            <PreviewArticleModal article={selectedItem || {}} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} categories={categories} />

            <AlertDeleteConfirmation
                open={isDeleteOpen} onOpenChange={setIsDeleteOpen}
                onConfirm={handleConfirmDelete}
                title="Hapus Artikel" description="Apakah Anda yakin ingin menghapus artikel ini?"
            />
        </div>
    );
}