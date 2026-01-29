"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/article/ArticleColumns";
import { getArticles, saveArticles } from "@/utils/article-storage";
import { type Article } from "@/constants/articles";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";

export default function ArticlePage() {
    const router = useRouter();
    const [data, setData] = React.useState<Article[]>([]);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<Article[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

    React.useEffect(() => {
        setData(getArticles());
    }, []);

    const handleDataChange = (newData: Article[]) => {
        const updatedData = newData.map((newArticle) => {
            const oldArticle = data.find((a) => a.id === newArticle.id);
            if (!oldArticle) return newArticle;
            if (newArticle.is_published && !oldArticle.is_published) {
                return { ...newArticle, published_at: new Date() };
            }
            if (!newArticle.is_published && oldArticle.is_published) {
                return { ...newArticle, published_at: null };
            }
            return newArticle;
        });

        setData(updatedData);
        saveArticles(updatedData);
    };

    const sortOptions = [
        { label: "Created At", value: "created_at" },
        { label: "Published At", value: "published_at" },
    ];

    const handleDeleteSelected = (selectedRows: Article[]) => {
        setRowsToDelete(selectedRows);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const selectedIds = new Set(rowsToDelete.map((row) => row.id));
        const newData = data.filter((row) => !selectedIds.has(row.id));
        setData(newData);
        saveArticles(newData);
        setIsDeleteDialogOpen(false);
        setRowsToDelete([]);
        setSuccess("Article(s) deleted successfully");
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="w-full">
            {success && <AlertSuccess2 message={success} />}

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Article Management</h2>
            </div>

            <DataTable
                data={data}
                columns={columns}
                onDataChange={handleDataChange}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => router.push("/article/create")}
                sortOptions={sortOptions}
            />

            <AlertDeleteConfirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Article"
                description={`Are you sure you want to delete ${rowsToDelete.length} article(s)?`}
            />
        </div>
    );
}
