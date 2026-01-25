import {type ArticleCategory } from "./article_category";

export interface Article {
    id: string;
    thumbnail: string;
    title: string;
    category: ArticleCategory['id'][];
    content: string;
    is_published: boolean;
    view_count: number;
    created_at: Date;
    published_at: Date | null;
    updated_at: Date;
    deleted_at: Date | null;
}
