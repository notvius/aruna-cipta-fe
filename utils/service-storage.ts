import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { Service } from "@/constants/services";

import { servicesData } from "@/data/services";

const STORAGE_KEY = "aruna_services_v2";

export const getServices = (): Service[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        safeLocalStorageSet(STORAGE_KEY, JSON.stringify(servicesData));
        return servicesData;
    }

    try {
        const parsed = JSON.parse(stored) as Service[];

        if (parsed.length === 0) {
            saveServices(servicesData);
            return servicesData;
        }

        const hasStalePaths = parsed.some(svc =>
            !svc.featured_image.startsWith("/images/") &&
            !svc.featured_image.startsWith("data:")
        );

        if (hasStalePaths) {
            saveServices(servicesData); 
            return servicesData;
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
