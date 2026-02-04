"use client";

import { Article } from "@/constants/articles";
import { articlesData as mockArticles } from "@/data/articles";

const STORAGE_KEY = "aruna_articles_v2";

export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/<[^>]*>/g, '') 
        .replace(/[^\w ]+/g, '') 
        .replace(/ +/g, '-');    
};

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
        return parsed;
    } catch (e) {
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

export const updateArticle = (updatedArticle: Article) => {
    const articles = getArticles();
    const updated = articles.map((article) =>
        Number(article.id) === Number(updatedArticle.id) ? updatedArticle : article
    );
    saveArticles(updated);
};