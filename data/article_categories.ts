import { ArticleCategory } from "@/constants/article_category";

export const articleCategoryData: ArticleCategory[] = [
    {
        id: "CAT001",
        name: "Science",
        article_id: ["ART001"],
        created_at: new Date("2024-01-01T10:00:00Z"),
        updated_at: new Date("2024-01-02T10:00:00Z"),
    },
    {
        id: "CAT002",
        name: "Automotive",
        article_id: ["ART002"],
        created_at: new Date("2024-01-05T10:00:00Z"),
        updated_at: new Date("2024-01-05T10:00:00Z"),
    },
    {
        id: "CAT003",
        name: "AI",
        article_id: ["ART003"],
        created_at: new Date("2024-01-10T10:00:00Z"),
        updated_at: new Date("2024-01-12T10:00:00Z"),
    },
    {
        id: "CAT004",
        name: "Politics",
        article_id: ["ART004"],
        created_at: new Date("2024-01-15T10:00:00Z"),
        updated_at: new Date("2024-01-15T10:00:00Z"),
    },
    {
        id: "CAT005",
        name: "Food",
        article_id: ["ART005"],
        created_at: new Date("2024-01-20T10:00:00Z"),
        updated_at: new Date("2024-01-21T10:00:00Z"),
    },
];