"use client";

import * as React from "react";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import { ColumnDef } from "@tanstack/react-table";
import { type AnalyticsSummaryItem } from "@/constants/guest_events";

const whatsappTrendData = [
    { name: "Mon", clicks: 25 },
    { name: "Tue", clicks: 38 },
    { name: "Wed", clicks: 32 },
    { name: "Thu", clicks: 45 },
    { name: "Fri", clicks: 50 },
    { name: "Sat", clicks: 65 },
    { name: "Sun", clicks: 58 },
];

export default function WhatsAppAnalyticsPage() {
    const summaryItems: AnalyticsSummaryItem[] = [
        { 
            label: "Total WhatsApp Clicks", 
            value: "1,428", 
            trend: "+18.4%", 
            iconType: "mouse" 
        }
    ];

    const performanceColumns: ColumnDef<any>[] = [
        { 
            accessorKey: "page_title", 
            header: "Origin Page",
            cell: ({ row }) => <div className="min-w-[200px] font-bold text-blue-600">{row.original.page_title}</div>
        },
        { accessorKey: "total_clicks", header: "Clicks" },
        { 
            accessorKey: "last_click", 
            header: "Last Activity",
            cell: ({ row }) => {
                const date = row.original.last_click;
                return date ? new Date(date).toLocaleDateString("id-ID") : "N/A";
            }
        },
    ];

    const performanceData = [
        { id: 1, page_title: "Homepage", total_clicks: 850, last_click: "2026-02-05" },
        { id: 2, page_title: "Contact Us", total_clicks: 320, last_click: "2026-02-06" },
        { id: 3, page_title: "Service Detail - Web Dev", total_clicks: 158, last_click: "2026-02-07" },
        { id: 4, page_title: "Growth Pass Page", total_clicks: 100, last_click: "2026-02-07" },
    ];

    return (
        <div className="flex flex-col gap-6 p-0">
            <GuestEventDashboard
                header={{
                    title: "WhatsApp Analytics",
                    description: "Monitor direct communication leads and guest inquiries via WhatsApp",
                }}
                summary={summaryItems}
                trendTitle="WHATSAPP INQUIRY TREND"
                trendData={whatsappTrendData}
                trendConfig={{
                    clicks: { label: "WA Clicks", color: "#3b82f6" },
                }}
                trendDataKeys={["clicks"]}
                performanceTitle="CLICKS BY ORIGIN PAGE"
                performanceData={performanceData}
                performanceColumns={performanceColumns}
                rawEventsTitle="WHATSAPP CLICK LOGS"
                rawEventsData={[]} 
                rawEventsColumns={[]} 
            />
        </div>
    );
}