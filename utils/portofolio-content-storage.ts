import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { PortofolioContent } from "@/constants/portofolios_contents";

const STORAGE_KEY = "aruna_portofolios_contents_v1";

export const getPortofolioContents = (): PortofolioContent[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    }

    try {
        const parsed = JSON.parse(stored) as PortofolioContent[];
        return parsed;
    } catch (e) {
        console.error("Failed to parse portofolio contents from localStorage", e);
        return [];
    }
};

export const savePortofolioContents = (contents: PortofolioContent[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(contents));
};

export const addPortofolioContent = (newContent: PortofolioContent) => {
    const contents = getPortofolioContents();
    const updated = [newContent, ...contents];
    savePortofolioContents(updated);
};
