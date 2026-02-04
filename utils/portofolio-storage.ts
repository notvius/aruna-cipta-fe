"use client";

import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { Portofolio } from "@/constants/portofolios";
import { portofoliosData as mockPortofolios } from "@/data/portofolios";

const STORAGE_KEY = "aruna_portofolios_v3";

export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/<[^>]*>/g, '') 
        .replace(/[^\w ]+/g, '') 
        .replace(/ +/g, '-');    
};

export const getPortofolios = (): Portofolio[] => {
    if (typeof window === "undefined") return mockPortofolios;

    cleanupOldStorage();
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPortofolios));
        return mockPortofolios;
    }

    try {
        const parsed = JSON.parse(stored) as Portofolio[];
        return parsed;
    } catch (e) {
        console.error("Failed to parse portfolio from localStorage", e);
        return mockPortofolios;
    }
};


export const savePortofolios = (portofolios: Portofolio[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(portofolios));
};

export const addPortofolio = (newPortofolio: Portofolio) => {
    const portofolios = getPortofolios();
    const payload = {
        ...newPortofolio,
        slug: newPortofolio.slug || generateSlug(newPortofolio.title)
    };
    const updated = [payload, ...portofolios];
    savePortofolios(updated);
};

export const updatePortofolio = (updatedPortofolio: Portofolio) => {
    const portofolios = getPortofolios();
    const updated = portofolios.map((p) =>
        Number(p.id) === Number(updatedPortofolio.id) ? updatedPortofolio : p
    );
    savePortofolios(updated);
};