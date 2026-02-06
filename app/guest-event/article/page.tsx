"use client";

import * as React from "react";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import { articleTrendData, guestEventsMockData } from "@/data/guest_event";
import { ColumnDef } from "@tanstack/react-table";
import { type AnalyticsSummaryItem } from "@/constants/guest_events";

export default function ArticleAnalyticsPage() {
    const summaryItems: AnalyticsSummaryItem[] = [
        { label: "Total Views", value: "1,284", trend: "+12.5%", iconType: "eye" },
        { label: "Read Start", value: "962", trend: "+8.2%", iconType: "play" },
        { label: "Read Finish", value: "413", trend: "+4.1%", iconType: "check" },
        { label: "Avg Completion", value: "61%", trend: "+2.4%", iconType: "chart" }
    ];

    const performanceColumns: ColumnDef<any>[] = [
        { 
            accessorKey: "title", 
            header: "Article Title",
            cell: ({ row }) => <div className="min-w-[200px] font-medium">{row.original.title}</div>
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
                return date instanceof Date ? date.toLocaleString("id-ID") : "N/A";
            }
        },
        { accessorKey: "event_type", header: "Type" },
        { accessorKey: "event_subtype", header: "Subtype" },
        { accessorKey: "ip_address", header: "IP Address" },
        { 
            accessorKey: "page_url", 
            header: "URL",
            cell: ({ row }) => <div className="min-w-[250px] italic text-slate-500">{row.original.page_url}</div>
        },
    ];

    const performanceData = [
        { id: 1, title: "Is alien exist?", views: 842, start: 760, finish: 580, completion: "76%", publishedAt: "2026-01-10" },
        { id: 2, title: "BYD vs Tesla who will win?", views: 721, start: 690, finish: 392, completion: "56%", publishedAt: "2026-01-15" },
        { id: 3, title: "The Future of AI 2026", views: 688, start: 540, finish: 141, completion: "26%", publishedAt: "2026-01-20" },
        { id: 4, title: "Data Integrity in Web 3.0", views: 533, start: 498, finish: 222, completion: "44%", publishedAt: "2026-01-25" }
    ];

    return (
        <div className="flex flex-col gap-6 p-0">
            <GuestEventDashboard
                header={{
                    title: "Article Analytics",
                    description: "Monitor content engagement and reader behavior patterns",
                }}
                summary={summaryItems}
                trendTitle="ARTICLE READS TREND"
                trendData={articleTrendData}
                trendConfig={{
                    views: { label: "Views", color: "#3b82f6" },
                    start: { label: "Read Start", color: "#60a5fa" },
                    finish: { label: "Read Finish", color: "#93c5fd" },
                }}
                trendDataKeys={["views", "start", "finish"]}
                performanceTitle="TOP ARTICLES PERFORMANCE"
                performanceData={performanceData}
                performanceColumns={performanceColumns}
                rawEventsTitle="RAW EVENTS"
                rawEventsData={guestEventsMockData.filter(e => e.event_subtype.includes("article"))}
                rawEventsColumns={rawEventsColumns}
            />
        </div>
    );
}