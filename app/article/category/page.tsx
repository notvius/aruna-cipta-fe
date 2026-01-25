"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/article_category/ArticleCategoryColumns";
import { type ArticleCategory } from "@/constants/article_category";
import { getArticleCategories, saveArticleCategories } from "@/utils/article-category-storage";
import { CreateArticleCategoryModal } from "@/components/organisms/article_category/CreateArticleCategoryModal";

export default function ArticleCategoryPage() {
    const [articleCategories, setArticleCategories] = React.useState<ArticleCategory[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

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
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        const newData = articleCategories.filter((row) => !selectedIds.has(row.id));
        setArticleCategories(newData);
        saveArticleCategories(newData);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">FAQ Management</h2>
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
        </div>
    );
}