"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/article_category/ArticleCategoryColumns";
import { type ArticleCategory } from "@/constants/article_category";
import { getArticleCategories, saveArticleCategories } from "@/utils/article-category-storage";
import { CreateArticleCategoryModal } from "@/components/organisms/article_category/CreateArticleCategoryModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";

export default function ArticleCategoryPage() {
    const [articleCategories, setArticleCategories] = React.useState<ArticleCategory[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<ArticleCategory[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

    const refreshArticleCategories = React.useCallback(() => {
        setArticleCategories(getArticleCategories());
    }, []);

    React.useEffect(() => {
        refreshArticleCategories();
    }, [refreshArticleCategories]);

    const handleDataChange = (newData: ArticleCategory[]) => {
        setArticleCategories(newData);
        saveArticleCategories(newData);
    };

    const sortOptions = [
        { label: "Created At", value: "created_at" },
        { label: "Updated At", value: "updated_at" },
    ];

    const handleDeleteSelected = (selectedRows: ArticleCategory[]) => {
        setRowsToDelete(selectedRows);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const selectedIds = new Set(rowsToDelete.map((row) => row.id));
        const newData = articleCategories.filter((row) => !selectedIds.has(row.id));
        setArticleCategories(newData);
        saveArticleCategories(newData);
        setIsDeleteDialogOpen(false);
        setRowsToDelete([]);
        setSuccess("Article Category(s) deleted successfully");
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="w-full">
            {success && <AlertSuccess2 message={success} />}

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Article Category Management</h2>
            </div>

            <DataTable
                data={articleCategories}
                columns={columns}
                onDataChange={handleDataChange}
                sortOptions={sortOptions}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => setIsCreateModalOpen(true)}
            />

            <CreateArticleCategoryModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={refreshArticleCategories}
            />

            <AlertDeleteConfirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete Article Category"
                description={`Are you sure you want to delete ${rowsToDelete.length} article category(s)?`}
            />
        </div>
    );
}