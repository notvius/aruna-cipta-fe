import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { Portofolio } from "@/constants/portofolios";

const STORAGE_KEY = "aruna_portofolios_v2";

export const getPortofolios = (): Portofolio[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    }

    try {
        const parsed = JSON.parse(stored) as Portofolio[];

        const hasStalePaths = parsed.some(gal =>
            !gal.thumbnail.startsWith("/images/") &&
            !gal.thumbnail.startsWith("data:")
        );

        if (hasStalePaths) {
            safeLocalStorageSet(STORAGE_KEY, JSON.stringify([]));
            return [];
        }

        return parsed;
    } catch (e) {
        console.error("Failed to parse portofolio from localStorage", e);
        return [];
    }
};

export const savePortofolios = (portofolios: Portofolio[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(portofolios));
};

export const addPortofolio = (newPortofolio: Portofolio) => {
    const portofolios = getPortofolios();
    const updated = [newPortofolio, ...portofolios];
    savePortofolios(updated);
};
