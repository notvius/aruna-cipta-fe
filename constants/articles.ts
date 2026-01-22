export interface Article {
    id: string;
    thumbnail: string;
    title: string;
    category: string;
    content: string;
    status: "Published" | "Unpublished";
    createdAt: string;
    updatedAt: string;
    views: number;
}
