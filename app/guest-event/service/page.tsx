"use client";

import * as React from "react";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import { ColumnDef } from "@tanstack/react-table";
import { type AnalyticsSummaryItem } from "@/constants/guest_events";
import { servicesData } from "@/data/services"; 

export default function ServiceAnalyticsPage() {
    const servicesWithStats = React.useMemo(() => {
        const mockClicks = [842, 721, 688, 533, 412, 210]; 
        return servicesData.map((service, index) => ({
            ...service,
            total_clicks: mockClicks[index] || 0,
        })).sort((a, b) => b.total_clicks - a.total_clicks);
    }, []);

    const totalClicks = React.useMemo(() => {
        return servicesWithStats.reduce((acc, curr) => acc + curr.total_clicks, 0);
    }, [servicesWithStats]);

    const summaryItems: AnalyticsSummaryItem[] = [
        { 
            label: "Total Service Clicks", 
            value: totalClicks.toLocaleString(), 
            trend: "+14.2%", 
            iconType: "mouse" 
        },
        { 
            label: "Top Services Ranking", 
            value: `1. ${servicesWithStats[0]?.title.toUpperCase()}`, 
            trend: `2. ${servicesWithStats[1]?.title.toUpperCase()} • 3. ${servicesWithStats[2]?.title.toUpperCase()}`, 
            iconType: "chart" 
        }
    ];

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
            header: "Created At",
            cell: ({ row }) => {
                const date = row.original.created_at;
                return date instanceof Date ? date.toLocaleDateString("id-ID") : "N/A";
            }
        }
    ];

    const trendData = [
        { name: "Mon", [servicesWithStats[0]?.title]: 45, [servicesWithStats[1]?.title]: 30, [servicesWithStats[2]?.title]: 25 },
        { name: "Tue", [servicesWithStats[0]?.title]: 52, [servicesWithStats[1]?.title]: 42, [servicesWithStats[2]?.title]: 30 },
        { name: "Wed", [servicesWithStats[0]?.title]: 48, [servicesWithStats[1]?.title]: 40, [servicesWithStats[2]?.title]: 35 },
        { name: "Thu", [servicesWithStats[0]?.title]: 70, [servicesWithStats[1]?.title]: 65, [servicesWithStats[2]?.title]: 50 },
        { name: "Fri", [servicesWithStats[0]?.title]: 85, [servicesWithStats[1]?.title]: 75, [servicesWithStats[2]?.title]: 60 },
        { name: "Sat", [servicesWithStats[0]?.title]: 110, [servicesWithStats[1]?.title]: 95, [servicesWithStats[2]?.title]: 80 },
        { name: "Sun", [servicesWithStats[0]?.title]: 95, [servicesWithStats[1]?.title]: 80, [servicesWithStats[2]?.title]: 75 },
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
                    [servicesWithStats[0]?.title]: { label: servicesWithStats[0]?.title, color: "#3b82f6" },
                    [servicesWithStats[1]?.title]: { label: servicesWithStats[1]?.title, color: "#f97316" },
                    [servicesWithStats[2]?.title]: { label: servicesWithStats[2]?.title, color: "#93c5fd" },
                }}
                trendDataKeys={[servicesWithStats[0]?.title, servicesWithStats[1]?.title, servicesWithStats[2]?.title]}
                performanceTitle="SERVICE PERFORMANCE LIST"
                performanceData={servicesWithStats}
                performanceColumns={performanceColumns}
                rawEventsTitle="SERVICE INTERACTION LOGS"
                rawEventsData={[]} 
                rawEventsColumns={[]} 
            />
        </div>
    );
}