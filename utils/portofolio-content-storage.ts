"use client";

import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { PortofolioContent } from "@/constants/portofolios_contents";
import { portofoliosContentsData as mockContents } from "@/data/portofolios_contents";

const STORAGE_KEY = "aruna_portofolios_contents_v2";

export const getPortofolioContents = (): PortofolioContent[] => {
    if (typeof window === "undefined") return mockContents;

    cleanupOldStorage();
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockContents));
        return mockContents;
    }

    try {
        const parsed = JSON.parse(stored) as PortofolioContent[];
        return parsed;
    } catch (e) {
        console.error("Failed to parse portfolio contents from localStorage", e);
        return mockContents;
    }
};

export const getPortofolioContentById = (portfolioId: number): PortofolioContent | undefined => {
    const contents = getPortofolioContents();
    return contents.find((c) => Number(c.portofolio_id) === Number(portfolioId));
};

export const savePortofolioContents = (contents: PortofolioContent[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(contents));
};

export const addOrUpdatePortofolioContent = (newContent: PortofolioContent) => {
    const contents = getPortofolioContents();
    const exists = contents.findIndex(c => Number(c.portofolio_id) === Number(newContent.portofolio_id));
    
    let updated;
    if (exists !== -1) {
        updated = [...contents];
        updated[exists] = newContent;
    } else {
        updated = [newContent, ...contents];
    }
    savePortofolioContents(updated);
};

export const deleteContentByPortfolioId = (portfolioId: number) => {
    const contents = getPortofolioContents();
    const updated = contents.filter(c => Number(c.portofolio_id) !== Number(portfolioId));
    savePortofolioContents(updated);
};