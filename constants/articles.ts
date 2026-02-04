import { type ArticleCategory } from "./article_category";

export interface Article {
    id: number;
    thumbnail: string;
    title: string;
    slug: string;
    excerpt: string,
    category: number[];
    content: string;
    is_published: boolean;
    view_count: number;
    created_at: Date | string;
    published_at: Date | string | null;
    updated_at: Date | string;
    deleted_at: Date | string | null;
}