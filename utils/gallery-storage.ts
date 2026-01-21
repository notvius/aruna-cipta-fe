"use client";

import { Gallery } from "@/constants/galleries";
import { galleriesData as mockGalleries } from "@/data/galleries";

const STORAGE_KEY = "aruna_galleries_v2";

export const getGalleries = (): Gallery[] => {
    if (typeof window === "undefined") return mockGalleries;

    const stored = localStorage.getItem(STORAGE_KEY);

    if (localStorage.getItem("aruna_galleries")) {
        localStorage.removeItem("aruna_galleries");
    }

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGalleries));
        return mockGalleries;
    }

    try {
        const parsed = JSON.parse(stored) as Gallery[];

        const hasStalePaths = parsed.some(gal =>
            !gal.file_path.startsWith("/images/") &&
            !gal.file_path.startsWith("data:")
        );

        if (hasStalePaths) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGalleries));
            return mockGalleries;
        }

        return parsed;
    } catch (e) {
        console.error("Failed to parse galleries from localStorage", e);
        return mockGalleries;
    }
};

export const saveGalleries = (galleries: Gallery[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(galleries));
};

export const addGallery = (newGallery: Gallery) => {
    const galleries = getGalleries();
    const updated = [newGallery, ...galleries];
    saveGalleries(updated);
};
