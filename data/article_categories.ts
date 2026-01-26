import { ArticleCategory } from "@/constants/article_category";

export const articleCategoryData: ArticleCategory[] = [
    {
        id: 1,
        name: "Science",
        article_id: [1],
        created_at: new Date("2024-01-01T10:00:00Z"),
        updated_at: new Date("2024-01-02T10:00:00Z"),
    },
    {
        id: 2,
        name: "Automotive",
        article_id: [2],
        created_at: new Date("2024-01-05T10:00:00Z"),
        updated_at: new Date("2024-01-05T10:00:00Z"),
    },
    {
        id: 3,
        name: "AI",
        article_id: [3],
        created_at: new Date("2024-01-10T10:00:00Z"),
        updated_at: new Date("2024-01-12T10:00:00Z"),
    },
    {
        id: 4,
        name: "Politics",
        article_id: [4],
        created_at: new Date("2024-01-15T10:00:00Z"),
        updated_at: new Date("2024-01-15T10:00:00Z"),
    },
    {
        id: 5,
        name: "Food",
        article_id: [5],
        created_at: new Date("2024-01-20T10:00:00Z"),
        updated_at: new Date("2024-01-21T10:00:00Z"),
    },
];