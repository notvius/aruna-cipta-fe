import { GuestEvent, TrendData } from "@/constants/guest_events";

export const guestEventsMockData: GuestEvent[] = [
    {
        id: 1,
        event_type: "page_view",
        event_subtype: "article",
        page_url: "/articles/cara-meningkatkan-brand-awareness",
        ip_address: "103.21.45.12",
        user_agent: "Chrome / Windows 10",
        created_at: new Date("2025-01-20T09:01:12"),
    },
    {
        id: 2,
        event_type: "read",
        event_subtype: "article_start",
        page_url: "/articles/cara-meningkatkan-brand-awareness",
        ip_address: "103.21.45.12",
        user_agent: "Chrome / Windows 10",
        created_at: new Date("2025-01-20T09:01:20"),
    },
    {
        id: 3,
        event_type: "read",
        event_subtype: "article_end",
        page_url: "/articles/cara-meningkatkan-brand-awareness",
        ip_address: "103.21.45.12",
        user_agent: "Chrome / Windows 10",
        created_at: new Date("2025-01-20T09:05:48"),
    }
];

export const articleTrendData = [
    { name: "Mon", views: 420, start: 310, finish: 220 },
    { name: "Tue", views: 580, start: 450, finish: 390 },
    { name: "Wed", views: 490, start: 400, finish: 310 },
    { name: "Thu", views: 820, start: 710, finish: 580 },
    { name: "Fri", views: 740, start: 620, finish: 490 },
    { name: "Sat", views: 960, start: 840, finish: 710 },
    { name: "Sun", views: 880, start: 790, finish: 650 },
];