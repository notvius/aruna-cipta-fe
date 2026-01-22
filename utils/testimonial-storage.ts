import { safeLocalStorageSet, cleanupOldStorage } from "./storage-utils";
import { Testimonial } from "@/constants/testimonials";
import { testimonialsData } from "@/data/testimonials";

const STORAGE_KEY = "aruna_testimonials_v2";

export const getTestimonials = (): Testimonial[] => {
    if (typeof window === "undefined") return [];

    cleanupOldStorage();

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        saveTestimonials(testimonialsData);
        return testimonialsData;
    }

    try {
        const parsed = JSON.parse(stored);

        return parsed;
    } catch (e) {
        console.error("Failed to parse testimonials", e);
        return [];
    }
};

export const saveTestimonials = (testimonials: Testimonial[]) => {
    if (typeof window === "undefined") return;
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(testimonials));
};

export const addTestimonial = (newTestimonial: Testimonial) => {
    const testimonials = getTestimonials();
    const updated = [newTestimonial, ...testimonials];
    saveTestimonials(updated);
};
