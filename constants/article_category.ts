import { type Article } from "@/data/articles";

export interface ArticleCategory {
    id: string;
    name: string;
    article_id: Article['id'][];
    created_at: Date;
    updated_at: Date;
}