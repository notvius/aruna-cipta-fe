"use client";

import { Article } from "@/constants/articles";
import { articlesData as mockArticles } from "@/data/articles";

const STORAGE_KEY = "aruna_articles_v2";

export const getArticles = (): Article[] => {
    if (typeof window === "undefined") return mockArticles;

    const stored = localStorage.getItem(STORAGE_KEY);

    if (localStorage.getItem("aruna_articles")) {
        localStorage.removeItem("aruna_articles");
    }

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockArticles));
        return mockArticles;
    }

    try {
        const parsed = JSON.parse(stored) as Article[];

        const hasStalePaths = parsed.some(art => art.thumbnail?.startsWith("@/public"));

        if (hasStalePaths) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockArticles));
            return mockArticles;
        }

        return parsed;
    } catch (e) {
        console.error("Failed to parse articles from localStorage", e);
        return mockArticles;
    }
};

export const saveArticles = (articles: Article[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
};

export const addArticle = (newArticle: Article) => {
    const articles = getArticles();
    const updated = [newArticle, ...articles];
    saveArticles(updated);
};

export const getArticleById = (id: number |string): Article | undefined => {
    const articles = getArticles();
    return articles.find((article) => Number(article.id) === Number(id));
};

export const updateArticle = (updatedArticle: Article) => {
    const articles = getArticles();
    const updated = articles.map((article) =>
        Number(article.id) === Number(updatedArticle.id) ? updatedArticle : article
    );
    saveArticles(updated);
};
