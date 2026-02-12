"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import { ColumnDef } from "@tanstack/react-table";
import { type GuestEvent, type AnalyticsSummaryItem, type TrendData } from "@/constants/guest_events";

export default function GrowthPassAnalyticsPage() {
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

            const growthEvents = actualData.filter((e: GuestEvent) =>
                e.event_subtype === "innovate" ||
                e.event_subtype === "growth" ||
                e.event_subtype === "optimize"
            );

            setEvents(growthEvents);
        } catch (err) {
            console.error("Failed to fetch growth pass events", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    const summaryItems = React.useMemo<AnalyticsSummaryItem[]>(() => {
        const total = events.length;
        const counts = {
            innovate: events.filter(e => e.event_subtype === "innovate").length,
            growth: events.filter(e => e.event_subtype === "growth").length,
            optimize: events.filter(e => e.event_subtype === "optimize").length,
        };

        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

        return [
            {
                label: "Total Clicks Engagement",
                value: total.toLocaleString(),
                trend: "Live",
                iconType: "mouse"
            },
            {
                label: "Top Category",
                value: top?.[0]?.toUpperCase() || "N/A",
                trend: `${top?.[1] || 0} clicks`,
                iconType: "chart"
            }
        ];
    }, [events]);

    const trendData = React.useMemo<TrendData[]>(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const stats = days.map(day => ({ name: day, innovate: 0, growth: 0, optimize: 0 }));

        events.forEach(event => {
            const dayIndex = new Date(event.created_at).getDay();
            const dayName = days[dayIndex];
            const entry = stats.find(s => s.name === dayName);
            if (entry) {
                if (event.event_subtype === "innovate") entry.innovate++;
                else if (event.event_subtype === "growth") entry.growth++;
                else if (event.event_subtype === "optimize") entry.optimize++;
            }
        });

        const todayIndex = new Date().getDay();
        return [
            ...stats.slice(todayIndex + 1),
            ...stats.slice(0, todayIndex + 1)
        ];
    }, [events]);

    const performanceData = React.useMemo(() => {
        const categories = ["innovate", "growth", "optimize"];
        return categories.map(cat => {
            const catEvents = events.filter(e => e.event_subtype === cat)
            return {
                id: cat,
                category: cat.toUpperCase(),
                total_clicks: catEvents.length,
            };
        }).sort((a, b) => b.total_clicks - a.total_clicks);
    }, [events]);

    const performanceColumns: ColumnDef<any>[] = [
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => <div className="min-w-[150px] font-bold text-blue-600">{row.original.category}</div>
        },
        { accessorKey: "total_clicks", header: "Total Clicks" },
    ];

    const rawEventsColumns: ColumnDef<any>[] = [
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => new Date(row.original.created_at).toLocaleString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        },
        { accessorKey: "event_subtype", header: "Category" },
        { accessorKey: "ip_address", header: "IP Address" },
        {
            accessorKey: "page_url",
            header: "URL",
            cell: ({ row }) => <div className="max-w-[200px] truncate italic text-slate-500">{row.original.page_url}</div>
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-0">
            <GuestEventDashboard
                header={{
                    title: "Growth Pass Analytics",
                    description: "Analysis of click engagement for Innovate, Growth, and Optimize categories",
                }}
                summary={summaryItems}
                trendTitle="GROWTH PASS CLICK TREND (LAST 7 DAYS)"
                trendData={trendData}
                trendConfig={{
                    innovate: { label: "Innovate", color: "#3b82f6" },
                    growth: { label: "Growth", color: "#f97316" },
                    optimize: { label: "Optimize", color: "#93c5fd" },
                }}
                trendDataKeys={["innovate", "growth", "optimize"]}
                performanceTitle="CATEGORY RANKING DETAILS"
                performanceData={performanceData}
                performanceColumns={performanceColumns}
                rawEventsTitle="GROWTH PASS LOGS"
                rawEventsData={events.slice(0, 50)}
                rawEventsColumns={rawEventsColumns}
            />
        </div>
    );
}