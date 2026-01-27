"use client";

import * as React from "react";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import {
    whatsappSummary,
    whatsappTrendData,
    whatsappPerformanceData,
} from "@/data/guest_event_analytics";
import { guestEventsData } from "@/data/guest_event";
import { ColumnDef } from "@tanstack/react-table";
import { ChartConfig } from "@/components/ui/chart";

export default function WhatsAppAnalyticsPage() {
    const [dateRange, setDateRange] = React.useState("Last 7 Days");

    const rawEventsColumns: ColumnDef<any>[] = [
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => row.original.created_at ? (row.original.created_at as Date).toLocaleString() : "N/A",
        },
        { accessorKey: "event_type", header: "Event Type" },
        { accessorKey: "event_subtype", header: "Subtype" },
        { accessorKey: "ip_address", header: "IP Address" },
        { accessorKey: "user_agent", header: "User Agent" },
        { accessorKey: "page_url", header: "Page URL" },
    ];

    const trendConfig = {
        clicks: { label: "Clicks", color: "#FF6B35" },
    } satisfies ChartConfig;

    return (
        <GuestEventDashboard
            header={{
                title: "WhatsApp Analytics",
                description: "Monitor WhatsApp conversion funnel and performance",
            }}
            filters={[
                {
                    label: "Date Range",
                    options: ["Last 24 Hours", "Last 7 Days", "Last 30 Days"],
                    value: dateRange,
                    onChange: setDateRange,
                },
            ]}
            summary={whatsappSummary}
            trendTitle="WHATSAPP CLICK TREND"
            trendData={whatsappTrendData}
            trendConfig={trendConfig}
            trendDataKeys={["clicks"]}
            detailTitle="SOURCE DETAIL"
            detailFields={(item) => [
                { label: "Date", value: item.created_at?.toLocaleString() },
                { label: "Event", value: item.event_type },
                { label: "Source URL", value: item.page_url },
            ]}
            rawEventsTitle="RAW EVENTS"
            rawEventsData={guestEventsData.filter(e => e.event_subtype === "whatsapp")}
            rawEventsColumns={rawEventsColumns}
            layoutVariant="whatsapp"
        />
    );
}