"use client";

import { Testimonial } from "@/constants/testimonials";
import { testimonialsData as mockTestimonials } from "@/data/testimonials";

const STORAGE_KEY = "aruna_testimonials";

export const getTestimonials = (): Testimonial[] => {
    if (typeof window === "undefined") return mockTestimonials;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTestimonials));
        return mockTestimonials;
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse testimonials from localStorage", e);
        return mockTestimonials;
    }
};

export const saveTestimonials = (testimonials: Testimonial[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
};

export const addTestimonial = (newTestimonial: Testimonial) => {
    const testimonials = getTestimonials();
    const updated = [newTestimonial, ...testimonials];
    saveTestimonials(updated);
};
