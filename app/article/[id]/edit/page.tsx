"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ArticleForm } from "@/components/organisms/article/ArticleForm";
import { getArticleById } from "@/utils/article-storage";
import { Article } from "@/constants/articles";

export default function EditArticlePage() {
    const params = useParams();
    const [article, setArticle] = React.useState<Article | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const id = params?.id as string;
        if (id) {
            const decodedId = decodeURIComponent(id);
            console.log("Fetching article with ID:", decodedId);
            const data = getArticleById(decodedId);
            console.log("Found data:", data);
            setArticle(data || null);
        }
        setIsLoading(false);
    }, [params]);

    if (isLoading) return <div className="p-8">Loading...</div>;

    if (!article) return <div className="p-8">Article not found</div>;

    return <ArticleForm mode="edit" initialData={article} />;
}
