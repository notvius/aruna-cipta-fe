import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { PortofolioOverview } from "@/constants/portofolio_overviews";

const STORAGE_KEY = "aruna_portofolios_overviews_v1";

export const getPortofolioOverviews = (): PortofolioOverview[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    }

    try {
        const parsed = JSON.parse(stored) as PortofolioOverview[];
        return parsed;
    } catch (e) {
        console.error("Failed to parse portofolio overviews from localStorage", e);
        return [];
    }
};

export const savePortofolioOverviews = (overviews: PortofolioOverview[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(overviews));
};

export const addPortofolioOverview = (newOverview: PortofolioOverview) => {
    const overviews = getPortofolioOverviews();
    const updated = [newOverview, ...overviews];
    savePortofolioOverviews(updated);
};
