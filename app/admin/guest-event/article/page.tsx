"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import { ColumnDef } from "@tanstack/react-table";
import { type GuestEvent, type AnalyticsSummaryItem, type TrendData } from "@/constants/guest_events";

export default function ArticleAnalyticsPage() {
    const [events, setEvents] = React.useState<GuestEvent[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guest-event`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            const actualData = Array.isArray(data) ? data : data.data || [];

            const articleEvents = actualData.filter((e: GuestEvent) =>
                e.event_subtype === "article" ||
                e.event_subtype === "article_start" ||
                e.event_subtype === "article_end"
            );

            setEvents(articleEvents);
        } catch (err) {
            console.error("Failed to fetch article events", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    const summaryItems = React.useMemo<AnalyticsSummaryItem[]>(() => {
        const totalViews = events.filter(e => e.event_subtype === "article").length;
        const readStart = events.filter(e => e.event_subtype === "article_start").length;
        const readFinish = events.filter(e => e.event_subtype === "article_end").length;
        const completionRate = readStart > 0 ? Math.round((readFinish / readStart) * 100) : 0;

        return [
            { label: "Total Views", value: totalViews.toLocaleString(), trend: "Live", iconType: "eye" },
            { label: "Read Start", value: readStart.toLocaleString(), trend: "Live", iconType: "play" },
            { label: "Read Finish", value: readFinish.toLocaleString(), trend: "Live", iconType: "check" },
            { label: "Avg Completion", value: `${completionRate}%`, trend: "Live", iconType: "chart" }
        ];
    }, [events]);

    const trendData = React.useMemo<TrendData[]>(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const stats = days.map(day => ({ name: day, views: 0, start: 0, finish: 0 }));

        events.forEach(event => {
            const dayIndex = new Date(event.created_at).getDay();
            const dayName = days[dayIndex];
            const entry = stats.find(s => s.name === dayName);
            if (entry) {
                if (event.event_subtype === "article") entry.views++;
                else if (event.event_subtype === "article_start") entry.start++;
                else if (event.event_subtype === "article_end") entry.finish++;
            }
        });

        const todayIndex = new Date().getDay();
        const sortedStats = [
            ...stats.slice(todayIndex + 1),
            ...stats.slice(0, todayIndex + 1)
        ];

        return sortedStats;
    }, [events]);

    const performanceData = React.useMemo(() => {
        const pages: Record<string, any> = {};

        events.forEach(event => {
            if (!pages[event.page_url]) {
                pages[event.page_url] = {
                    url: event.page_url,
                    title: event.page_url.split("/").pop()?.replace(/-/g, " ") || "Home",
                    views: 0,
                    start: 0,
                    finish: 0
                };
            }
            if (event.event_subtype === "article") pages[event.page_url].views++;
            else if (event.event_subtype === "article_start") pages[event.page_url].start++;
            else if (event.event_subtype === "article_end") pages[event.page_url].finish++;
        });

        return Object.values(pages).map(p => ({
            ...p,
            completion: p.start > 0 ? `${Math.round((p.finish / p.start) * 100)}%` : "0%"
        })).sort((a, b) => b.views - a.views);
    }, [events]);

    const performanceColumns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Article Title",
            cell: ({ row }) => <div className="min-w-[200px] font-medium capitalize text-slate-700">{row.original.title}</div>
        },
        { accessorKey: "views", header: "Views" },
        { accessorKey: "start", header: "Start" },
        { accessorKey: "finish", header: "Finish" },
        { accessorKey: "completion", header: "Rate" },
    ];

    const rawEventsColumns: ColumnDef<any>[] = [
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => {
                const date = row.original.created_at;
                return new Date(date).toLocaleString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "numeric",
                    month: "short"
                });
            }
        },
        { accessorKey: "event_type", header: "Type" },
        { accessorKey: "event_subtype", header: "Subtype" },
        { accessorKey: "ip_address", header: "IP Address" },
        {
            accessorKey: "page_url",
            header: "URL",
            cell: ({ row }) => <div className="min-w-[250px] italic text-slate-500 truncate">{row.original.page_url}</div>
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-0">
            <GuestEventDashboard
                header={{
                    title: "Article Analytics",
                    description: "Monitor content engagement and reader behavior patterns",
                }}
                summary={summaryItems}
                trendTitle="ARTICLE engagement TREND (LAST 7 DAYS)"
                trendData={trendData}
                trendConfig={{
                    views: { label: "Views", color: "#3b82f6" },
                    start: { label: "Read Start", color: "#60a5fa" },
                    finish: { label: "Read Finish", color: "#93c5fd" },
                }}
                trendDataKeys={["views", "start", "finish"]}
                performanceTitle="TOP ARTICLES PERFORMANCE"
                performanceData={performanceData}
                performanceColumns={performanceColumns}
                rawEventsTitle="LATEST ARTICLE EVENTS"
                rawEventsData={events.slice(0, 50)}
                rawEventsColumns={rawEventsColumns}
            />
        </div>
    );
}