"use client";

import { Article } from "@/constants/articles";
import { articlesData as mockArticles } from "@/data/articles";

const STORAGE_KEY = "aruna_articles";

export const getArticles = (): Article[] => {
    if (typeof window === "undefined") return mockArticles;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockArticles));
        return mockArticles;
    }

    try {
        return JSON.parse(stored);
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
