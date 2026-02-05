import { Service } from "@/constants/services";
import { servicesData } from "@/data/services";

const STORAGE_KEY = "aruna_services_v2";
const OLD_KEYS = ["aruna_services", "aruna_services_v1"];

export const safeLocalStorageSet = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        if (
            e instanceof DOMException &&
            (e.code === 22 ||
                e.code === 1014 ||
                e.name === "QuotaExceededError" ||
                e.name === "NS_ERROR_DOM_QUOTA_REACHED")
        ) {
            console.error("LocalStorage is full! Attempting cleanup...");
            
            OLD_KEYS.forEach((k) => localStorage.removeItem(k));

            try {
                localStorage.setItem(key, value);
            } catch (retryError) {
                console.error("Storage still full after cleanup.");
                alert(
                    "Penyimpanan browser penuh! Gagal menyimpan data.\n\n" +
                    "Saran: Gunakan gambar dengan ukuran lebih kecil (di bawah 500KB) atau hapus beberapa data lama."
                );
            }
        }
    }
};

export const cleanupOldStorage = () => {
    if (typeof window === "undefined") return;
    OLD_KEYS.forEach((key) => localStorage.removeItem(key));
};

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

        const hasStalePaths = parsed.some(
            (svc) =>
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
        return servicesData;
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

export const updateService = (updatedService: Service) => {
    const services = getServices();
    const updated = services.map((s) =>
        s.id === updatedService.id ? updatedService : s
    );
    saveServices(updated);
};