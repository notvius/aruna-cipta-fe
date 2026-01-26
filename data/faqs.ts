import type { Faq } from "@/constants/faqs";
export type { Faq } from "@/constants/faqs";

export const faqsData: Faq[] = [
    {
        id: 1,
        question: "What is React?",
        answer: "React is a JavaScript library for building user interfaces.",
        created_at: new Date("2024-01-01T10:00:00Z"),
        updated_at: new Date("2024-01-02T10:00:00Z"),
    },
    {
        id: 2,
        question: "What is Next.js?",
        answer: "Next.js is a React framework for building web applications.",
        created_at: new Date("2024-01-05T10:00:00Z"),
        updated_at: new Date("2024-01-05T10:00:00Z"),
    },
    {
        id: 3,
        question: "What is Tailwind CSS?",
        answer: "Tailwind CSS is a utility-first CSS framework for building custom designs.",
        created_at: new Date("2024-01-10T10:00:00Z"),
        updated_at: new Date("2024-01-11T10:00:00Z"),
    },
    {
        id: 4,
        question: "What is TypeScript?",
        answer: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
        created_at: new Date("2024-01-15T10:00:00Z"),
        updated_at: new Date("2024-01-15T10:00:00Z"),
    },
    {
        id: 5,
        question: "What is Redux?",
        answer: "Redux is a predictable state container for JavaScript apps.",
        created_at: new Date("2024-01-20T10:00:00Z"),
        updated_at: new Date("2024-01-21T10:00:00Z"),
    },
];