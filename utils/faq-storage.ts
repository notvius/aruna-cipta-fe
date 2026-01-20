"use client";

import { Faq } from "@/constants/faqs";
import { faqsData as mockFaqs } from "@/data/faqs";

const STORAGE_KEY = "aruna_faqs";

export const getFaqs = (): Faq[] => {
    if (typeof window === "undefined") return mockFaqs;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFaqs));
        return mockFaqs;
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse faqs from localStorage", e);
        return mockFaqs;
    }
};

export const saveFaqs = (faqs: Faq[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
};

export const addFaq = (newFaq: Faq) => {
    const faqs = getFaqs();
    const updated = [newFaq, ...faqs];
    saveFaqs(updated);
};
