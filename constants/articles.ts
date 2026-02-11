export interface Article {
    id: number;
    uuid: string;
    thumbnail: string;
    thumbnail_url?: string;
    title: string;
    slug: string;
    excerpt: string;
    article_category_id: number;
    category?: {
        id: number;
        name: string;
    };
    content: string;
    is_published: boolean;
    view_count: number;
    created_at: string;
    published_at: string | null;
    updated_at: string;
    deleted_at: string | null;
}

export interface ArticleCategory {
    id: number;
    uuid: string;
    name: string;
    created_at: string;
    updated_at: string;
}