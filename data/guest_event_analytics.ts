import { ArticleData } from "../components/charts/TopArticleChart";
import { type GuestEvent } from "./guest_event";

export interface ArticlePerformance {
    id: number;
    title: string;
    url: string;
    publishedAt: string;
    views: number;
    start: number;
    finish: number;
    completion: string;
}

export const articleSummary = [
    { label: "Total Views", value: "1,284" },
    { label: "Read Start", value: "962" },
    { label: "Read Finish", value: "413" },
    { label: "Avg Completion", value: "61%" },
];

export const articleTrendData = [
    { name: "Mon", views: 400, start: 240, finish: 200 },
    { name: "Tue", views: 300, start: 139, finish: 100 },
    { name: "Wed", views: 200, start: 980, finish: 800 },
    { name: "Thu", views: 278, start: 390, finish: 300 },
    { name: "Fri", views: 189, start: 480, finish: 400 },
    { name: "Sat", views: 239, start: 380, finish: 350 },
    { name: "Sun", views: 349, start: 430, finish: 410 },
];

export const articlePerformanceData: ArticlePerformance[] = [
    {
        id: 1,
        title: "Is alien exist?",
        url: "/article/is-alien-exist",
        publishedAt: "12 Jan 2024",
        views: 342,
        start: 260,
        finish: 180,
        completion: "69%",
    },
    {
        id: 2,
        title: "BYD vs Tesla who will win?",
        url: "/article/byd-vs-tesla",
        publishedAt: "15 Jan 2024",
        views: 221,
        start: 190,
        finish: 92,
        completion: "48%",
    },
    {
        id: 3,
        title: "The Future of AI",
        url: "/article/future-of-ai",
        publishedAt: "18 Jan 2024",
        views: 188,
        start: 140,
        finish: 41,
        completion: "22%",
    },
    {
        id: 4,
        title: "Data Integrity",
        url: "/article/data-integrity",
        publishedAt: "20 Jan 2025",
        views: 133,
        start: 98,
        finish: 22,
        completion: "22%",
    },
];

// --- Growth Pass Data ---
export const growthPassSummary = [
    { label: "Total Button Click", value: "850" },
    { label: "Top Pass Engaged", value: "Innovate" },
];

export const growthPassTrendData = [
    { name: "Mon", clicks: 100 },
    { name: "Tue", clicks: 120 },
    { name: "Wed", clicks: 80 },
    { name: "Thu", clicks: 150 },
    { name: "Fri", clicks: 200 },
    { name: "Sat", clicks: 100 },
    { name: "Sun", clicks: 100 },
];

export const growthPassPerformanceData = [
    { id: 1, pass: "Innovate", clicks: 450 },
    { id: 2, pass: "Launchpad", clicks: 300 },
    { id: 3, pass: "Operate", clicks: 100 },
];

// --- Service Data ---
export const serviceSummary = [
    { label: "Total Button Click", value: "2,400" },
    { label: "Top 3 Most Clicked", value: "Web, Mobile, UI/UX" },
];

export const serviceTrendData = [
    { name: "Mon", views: 300 },
    { name: "Tue", views: 400 },
    { name: "Wed", views: 350 },
    { name: "Thu", views: 500 },
    { name: "Fri", views: 450 },
    { name: "Sat", views: 200 },
    { name: "Sun", views: 200 },
];

export const servicePerformanceData = [
    { id: 1, service: "Digital Marketing", views: 1200 },
    { id: 2, service: "Web Development", views: 800 },
    { id: 3, service: "Consulting", views: 400 },
];

// --- WhatsApp Data ---
export const whatsappSummary = [
    { label: "Total Clicks", value: "450" },
];

export const whatsappTrendData = [
    { name: "Mon", clicks: 60 },
    { name: "Tue", clicks: 70 },
    { name: "Wed", clicks: 55 },
    { name: "Thu", clicks: 80 },
    { name: "Fri", clicks: 90 },
    { name: "Sat", clicks: 50 },
    { name: "Sun", clicks: 45 },
];

export const whatsappPerformanceData = [
    { id: 1, source: "Product Page", clicks: 300, messages: 250, sales: 30, conv: "10%" },
    { id: 2, source: "Contact Us", clicks: 150, messages: 130, sales: 12, conv: "8%" },
];
