"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import { ColumnDef } from "@tanstack/react-table";
import { type GuestEvent, type AnalyticsSummaryItem, type TrendData } from "@/constants/guest_events";
import { type Service } from "@/constants/services";

export default function ServiceAnalyticsPage() {
    const [events, setEvents] = React.useState<GuestEvent[]>([]);
    const [services, setServices] = React.useState<Service[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        setIsLoading(true);

        try {
            const [eventRes, serviceRes] = await Promise.all([
                fetch(`${baseUrl}/guest-event`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }),
                fetch(`${baseUrl}/service`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            ]);

            const eventData = await eventRes.json();
            const serviceData = await serviceRes.json();

            const actualEvents = Array.isArray(eventData) ? eventData : eventData.data || [];
            const actualServices = Array.isArray(serviceData) ? serviceData : serviceData.data || [];

            setServices(actualServices);

            const serviceTitles = actualServices.map((s: Service) => s.title.toLowerCase());
            const serviceEvents = actualEvents.filter((e: GuestEvent) =>
                e.event_type === "service" ||
                serviceTitles.includes(e.event_subtype.toLowerCase())
            );

            setEvents(serviceEvents);
        } catch (err) {
            console.error("Failed to fetch analytics data", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    const servicesWithStats = React.useMemo(() => {
        return services.map(s => {
            const catEvents = events.filter(e => e.event_subtype.toLowerCase() === s.title.toLowerCase());
            return {
                ...s,
                total_clicks: catEvents.length,
            };
        }).sort((a, b) => b.total_clicks - a.total_clicks);
    }, [events, services]);

    const totalClicks = React.useMemo(() => {
        return servicesWithStats.reduce((acc, curr) => acc + curr.total_clicks, 0);
    }, [servicesWithStats]);

    const summaryItems: AnalyticsSummaryItem[] = React.useMemo(() => [
        {
            label: "Total Service Clicks",
            value: totalClicks.toLocaleString(),
            trend: "Live",
            iconType: "mouse"
        },
        {
            label: "Top Services Ranking",
            value: `1. ${servicesWithStats[0]?.title?.toUpperCase() || "N/A"}`,
            trend: `2. ${servicesWithStats[1]?.title?.toUpperCase() || "..."} • 3. ${servicesWithStats[2]?.title?.toUpperCase() || "..."}`,
            iconType: "chart"
        }
    ], [totalClicks, servicesWithStats]);

    const trendData = React.useMemo<TrendData[]>(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const top3 = servicesWithStats.slice(0, 3);
        const stats = days.map(day => {
            const entry: any = { name: day };
            top3.forEach(s => entry[s.title] = 0);
            return entry;
        });

        events.forEach(event => {
            const date = new Date(event.created_at);
            if (isNaN(date.getTime())) return;
            
            const dayName = days[date.getDay()];
            const entry = stats.find(s => s.name === dayName);
            if (entry) {
                const serviceMatch = top3.find(s => s.title.toLowerCase() === event.event_subtype.toLowerCase());
                if (serviceMatch) entry[serviceMatch.title]++;
            }
        });

        const todayIndex = new Date().getDay();
        return [
            ...stats.slice(todayIndex + 1),
            ...stats.slice(0, todayIndex + 1)
        ];
    }, [events, servicesWithStats]);

    const performanceColumns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Service Title",
            cell: ({ row }) => <div className="min-w-[200px] font-bold text-blue-600">{row.original.title}</div>
        },
        {
            accessorKey: "total_clicks",
            header: "Total Clicks",
            cell: ({ row }) => <div className="font-semibold">{row.original.total_clicks}</div>
        },
        {
            accessorKey: "created_at",
            header: "First Activity",
            cell: ({ row }) => {
                const serviceEvents = events.filter(e => e.event_subtype.toLowerCase() === row.original.title.toLowerCase());
                if (serviceEvents.length === 0) return "N/A";
                
                const firstEvent = [...serviceEvents].sort((a, b) => 
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                )[0];
                
                return new Date(firstEvent.created_at).toLocaleDateString("id-ID");
            }
        }
    ];

    const rawEventsColumns: ColumnDef<any>[] = [
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => new Date(row.original.created_at).toLocaleString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        },
        { accessorKey: "event_subtype", header: "Service" },
        { accessorKey: "ip_address", header: "IP Address" },
        {
            accessorKey: "page_url",
            header: "URL",
            cell: ({ row }) => <div className="max-w-[150px] truncate italic text-slate-500">{row.original.page_url}</div>
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-0">
            <GuestEventDashboard
                header={{
                    title: "Service Analytics",
                    description: "Monitor guest engagement and discovery patterns across all digital services",
                }}
                summary={summaryItems}
                trendTitle="SERVICE CLICK TRENDS (TOP 3)"
                trendData={trendData}
                trendConfig={{
                    [servicesWithStats[0]?.title || "N/A"]: { label: servicesWithStats[0]?.title || "N/A", color: "#3b82f6" },
                    [servicesWithStats[1]?.title || "N/A"]: { label: servicesWithStats[1]?.title || "N/A", color: "#f97316" },
                    [servicesWithStats[2]?.title || "N/A"]: { label: servicesWithStats[2]?.title || "N/A", color: "#93c5fd" },
                }}
                trendDataKeys={servicesWithStats.slice(0, 3).map(s => s.title)}
                performanceTitle="SERVICE PERFORMANCE LIST"
                performanceData={servicesWithStats}
                performanceColumns={performanceColumns}
                rawEventsTitle="LATEST SERVICE INTERACTIONS"
                rawEventsData={events.slice(0, 50)}
                rawEventsColumns={rawEventsColumns}
            />
        </div>
    );
}