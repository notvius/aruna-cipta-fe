import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { ArticleCategory } from "@/constants/article_category";
import { articleCategoryData } from "@/data/article_categories";

const STORAGE_KEY = "aruna_article_categories_v2";

export const getArticleCategories = (): ArticleCategory[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        saveArticleCategories(articleCategoryData);
        return articleCategoryData;
    }

    try {
        const parsed = JSON.parse(stored);

        return parsed;
    } catch (e) {
        console.error("Failed to parse faqs", e);
        return [];
    }
};

export const saveArticleCategories = (articleCategories: ArticleCategory[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(articleCategories));
};

export const addArticleCategory = (name: string): ArticleCategory => {
    const articleCategories = getArticleCategories();
    
    const newCategory: ArticleCategory = {
        id: Date.now(),
        name: name,
        article_id: [], 
        created_at: new Date(),
        updated_at: new Date()
    };

    const updated = [newCategory, ...articleCategories];
    saveArticleCategories(updated);
    
    return newCategory; 
};