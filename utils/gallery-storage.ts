import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { Gallery } from "@/constants/galleries";

const STORAGE_KEY = "aruna_galleries_v2";

export const getGalleries = (): Gallery[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    }

    try {
        const parsed = JSON.parse(stored) as Gallery[];

        const hasStalePaths = parsed.some(gal =>
            !gal.file_path.startsWith("/images/") &&
            !gal.file_path.startsWith("data:")
        );

        if (hasStalePaths) {
            safeLocalStorageSet(STORAGE_KEY, JSON.stringify([]));
            return [];
        }

        return parsed;
    } catch (e) {
        console.error("Failed to parse galleries from localStorage", e);
        return [];
    }
};

export const saveGalleries = (galleries: Gallery[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(galleries));
};

export const addGallery = (newGallery: Gallery) => {
    const galleries = getGalleries();
    const updated = [newGallery, ...galleries];
    saveGalleries(updated);
};


export const updateGallery = (updatedGallery: Gallery) => {
    const galleries = getGalleries();
    const updated = galleries.map((g) => 
        g.id === updatedGallery.id ? updatedGallery : g
    );
    saveGalleries(updated);
};