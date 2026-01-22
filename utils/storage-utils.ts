"use client";

/**
 * Safely saves data to localStorage with QuotaExceededError handling.
 */
export const safeLocalStorageSet = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        if (e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        ) {
            alert("Storage quota exceeded. Please delete some items (especially images) to save your changes.");
            console.error("LocalStorage quota exceeded", e);
        } else {
            console.error("Failed to save to localStorage", e);
        }
    }
};

/**
 * Cleans up old or deprecated localStorage keys.
 */
export const cleanupOldStorage = () => {
    if (typeof window === "undefined") return;

    const deprecatedKeys = [
        "aruna_articles",
        "aruna_galleries",
        "aruna_services"
    ];

    deprecatedKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            console.log(`Cleaning up deprecated storage key: ${key}`);
            localStorage.removeItem(key);
        }
    });
};
