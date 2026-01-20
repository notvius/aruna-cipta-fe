"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/article/ArticleColumns";
import { getArticles, saveArticles } from "@/utils/article-storage";
import { type Article } from "@/constants/articles";

export default function ArticlePage() {
    const router = useRouter();
    const [data, setData] = React.useState<Article[]>([]);

    React.useEffect(() => {
        setData(getArticles());
    }, []);

    const handleDataChange = (newData: Article[]) => {
        setData(newData);
        saveArticles(newData);
    };

    const sortOptions = [
        { label: "Created At", value: "createdAt" },
        { label: "Published At", value: "publishedAt" },
    ];

    const handleDeleteSelected = (selectedRows: Article[]) => {
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        const newData = data.filter((row) => !selectedIds.has(row.id));
        setData(newData);
        saveArticles(newData);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Articles Management</h2>
            </div>

            <DataTable
                data={data}
                columns={columns}
                onDataChange={handleDataChange}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => router.push("/article/create")}
                sortOptions={sortOptions}
            />
        </div>
    );
}
