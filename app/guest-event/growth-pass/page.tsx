"use client";

import * as React from "react";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import { ColumnDef } from "@tanstack/react-table";
import { type AnalyticsSummaryItem } from "@/constants/guest_events";

const growthPassTrendData = [
    { name: "Mon", innovate: 45, growth: 30, optimize: 20 },
    { name: "Tue", innovate: 52, growth: 42, optimize: 35 },
    { name: "Wed", innovate: 48, growth: 40, optimize: 30 },
    { name: "Thu", innovate: 70, growth: 65, optimize: 55 },
    { name: "Fri", innovate: 85, growth: 75, optimize: 60 },
    { name: "Sat", innovate: 110, growth: 95, optimize: 85 },
    { name: "Sun", innovate: 95, growth: 80, optimize: 70 },
];

export default function GrowthPassAnalyticsPage() {
    const summaryItems: AnalyticsSummaryItem[] = [
        { 
            label: "Total Clicks Engagement", 
            value: "5,421", 
            trend: "+12.5%", 
            iconType: "mouse" 
        },
        { 
            label: "Category Ranking", 
            value: "1. INNOVATE", 
            trend: "2. GROWTH • 3. OPTIMIZE", 
            iconType: "chart" 
        }
    ];

    const performanceColumns: ColumnDef<any>[] = [
        { 
            accessorKey: "category", 
            header: "Category",
            cell: ({ row }) => <div className="min-w-[150px] font-bold text-blue-600">{row.original.category}</div>
        },
        { accessorKey: "total_clicks", header: "Total Clicks" },
        { accessorKey: "unique_guests", header: "Unique Guests" },
        { accessorKey: "rate", header: "Engagement Rate" },
    ];

    const performanceData = [
        { id: 1, category: "INNOVATE", total_clicks: 2450, unique_guests: 1800, rate: "45%" },
        { id: 2, category: "GROWTH", total_clicks: 1820, unique_guests: 1400, rate: "34%" },
        { id: 3, category: "OPTIMIZE", total_clicks: 1151, unique_guests: 900, rate: "21%" }
    ];

    return (
        <div className="flex flex-col gap-6 p-0">
            <GuestEventDashboard
                header={{
                    title: "Growth Pass Analytics",
                    description: "Analysis of click engagement for Innovate, Growth, and Optimize categories",
                }}
                summary={summaryItems}
                trendTitle="GROWTH PASS CLICK TREND"
                trendData={growthPassTrendData}
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
                rawEventsData={[]} 
                rawEventsColumns={[]} 
            />
        </div>
    );
}