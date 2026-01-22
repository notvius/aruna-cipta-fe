import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { Service } from "@/constants/services";

const STORAGE_KEY = "aruna_services_v2";

export const getServices = (): Service[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    }

    try {
        const parsed = JSON.parse(stored) as Service[];

        const hasStalePaths = parsed.some(svc =>
            !svc.featured_image.startsWith("/images/") &&
            !svc.featured_image.startsWith("data:")
        );

        if (hasStalePaths) {
            safeLocalStorageSet(STORAGE_KEY, JSON.stringify([]));
            return [];
        }

        return parsed;
    } catch (e) {
        console.error("Failed to parse services from localStorage", e);
        return [];
    }
};

export const saveServices = (services: Service[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(services));
};

export const addService = (newService: Service) => {
    const services = getServices();
    const updated = [newService, ...services];
    saveServices(updated);
};
