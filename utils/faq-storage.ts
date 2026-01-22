import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { Faq } from "@/constants/faqs";
import { faqsData } from "@/data/faqs";

const STORAGE_KEY = "aruna_faqs_v2";

export const getFaqs = (): Faq[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        saveFaqs(faqsData);
        return faqsData;
    }

    try {
        const parsed = JSON.parse(stored);

        return parsed;
    } catch (e) {
        console.error("Failed to parse faqs", e);
        return [];
    }
};

export const saveFaqs = (faqs: Faq[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(faqs));
};

export const addFaq = (newFaq: Faq) => {
    const faqs = getFaqs();
    const updated = [newFaq, ...faqs];
    saveFaqs(updated);
};
