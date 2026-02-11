"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import { ColumnDef } from "@tanstack/react-table";
import { type GuestEvent, type AnalyticsSummaryItem, type TrendData } from "@/constants/guest_events";

export default function WhatsAppAnalyticsPage() {
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

            const waEvents = actualData.filter((e: GuestEvent) =>
                e.event_subtype.toLowerCase() === "whatsapp" ||
                e.event_type.toLowerCase() === "whatsapp"
            );

            setEvents(waEvents);
        } catch (err) {
            console.error("Failed to fetch WhatsApp events", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    const summaryItems = React.useMemo<AnalyticsSummaryItem[]>(() => {
        return [
            {
                label: "Total WhatsApp Clicks",
                value: events.length.toLocaleString(),
                trend: "Live",
                iconType: "mouse"
            }
        ];
    }, [events]);

    const trendData = React.useMemo<TrendData[]>(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const stats = days.map(day => ({ name: day, clicks: 0 }));

        events.forEach(event => {
            const dayIndex = new Date(event.created_at).getDay();
            const dayName = days[dayIndex];
            const entry = stats.find(s => s.name === dayName);
            if (entry) entry.clicks++;
        });

        const todayIndex = new Date().getDay();
        return [
            ...stats.slice(todayIndex + 1),
            ...stats.slice(0, todayIndex + 1)
        ];
    }, [events]);

    const performanceData = React.useMemo(() => {
        const pages: Record<string, any> = {};

        events.forEach(event => {
            if (!pages[event.page_url]) {
                pages[event.page_url] = {
                    page_title: event.page_url.split("/").pop()?.replace(/-/g, " ") || "Homepage",
                    total_clicks: 0,
                    last_click: event.created_at
                };
            }
            pages[event.page_url].total_clicks++;
            if (new Date(event.created_at) > new Date(pages[event.page_url].last_click)) {
                pages[event.page_url].last_click = event.created_at;
            }
        });

        return Object.values(pages).sort((a, b) => b.total_clicks - a.total_clicks);
    }, [events]);

    const performanceColumns: ColumnDef<any>[] = [
        {
            accessorKey: "page_title",
            header: "Origin Page",
            cell: ({ row }) => <div className="min-w-[200px] font-bold text-blue-600 capitalize">{row.original.page_title}</div>
        },
        { accessorKey: "total_clicks", header: "Total Clicks" },
        {
            accessorKey: "last_click",
            header: "Last Activity",
            cell: ({ row }) => new Date(row.original.last_click).toLocaleString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        },
    ];

    const rawEventsColumns: ColumnDef<any>[] = [
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => new Date(row.original.created_at).toLocaleString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        },
        { accessorKey: "ip_address", header: "IP Address" },
        {
            accessorKey: "page_url",
            header: "Origin URL",
            cell: ({ row }) => <div className="max-w-[250px] truncate italic text-slate-500">{row.original.page_url}</div>
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-0">
            <GuestEventDashboard
                header={{
                    title: "WhatsApp Analytics",
                    description: "Monitor direct communication leads and guest inquiries via WhatsApp",
                }}
                summary={summaryItems}
                trendTitle="WHATSAPP INQUIRY TREND (LAST 7 DAYS)"
                trendData={trendData}
                trendConfig={{
                    clicks: { label: "WA Clicks", color: "#3b82f6" },
                }}
                trendDataKeys={["clicks"]}
                performanceTitle="CLICKS BY ORIGIN PAGE"
                performanceData={performanceData}
                performanceColumns={performanceColumns}
                rawEventsTitle="WHATSAPP CLICK LOGS"
                rawEventsData={events.slice(0, 50)}
                rawEventsColumns={rawEventsColumns}
            />
        </div>
    );
}