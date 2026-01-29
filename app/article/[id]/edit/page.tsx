"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ArticleForm } from "@/components/organisms/article/ArticleForm";
import { getArticleById } from "@/utils/article-storage";
import { Article } from "@/constants/articles";
import { Loader2 } from "lucide-react";

export default function EditArticlePage() {
    const params = useParams();
    const [article, setArticle] = React.useState<Article | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const id = params?.id as string;
        if (id) {
            const decodedId = decodeURIComponent(id);
            const numericId = Number(decodedId); 
            console.log("Fetching article with numeric ID:", numericId);
            const data = getArticleById(numericId);
            console.log("Found data:", data);
            setArticle(data || null);
        }
        setIsLoading(false);
    }, [params]);

    if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    if (!article) return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold">Article not found</h2>
            <p className="text-muted-foreground">ID: {params?.id}</p>
        </div>
    );

    return <ArticleForm mode="edit" initialData={article} />;
}
