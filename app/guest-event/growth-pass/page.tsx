"use client";

import * as React from "react";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import {
    growthPassSummary,
    growthPassTrendData,
    growthPassPerformanceData,
} from "@/data/guest_event_analytics";
import { guestEventsData } from "@/data/guest_event";
import { growthPassData } from "@/data/growth_pass";
import { ColumnDef } from "@tanstack/react-table";
import { ChartConfig } from "@/components/ui/chart";

export default function GrowthPassAnalyticsPage() {
    const [dateRange, setDateRange] = React.useState("Last 7 Days");
    const [selectedPass, setSelectedPass] = React.useState("All Passes");

    const performanceColumns: ColumnDef<any>[] = [
        { accessorKey: "pass", header: "Pass Name" },
        { accessorKey: "clicks", header: "Total Button Clicks" },
    ];

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
        clicks: { label: "Button Clicks", color: "#FF6B35" },
    } satisfies ChartConfig;

    const filteredPerformance = selectedPass === "All Passes"
        ? growthPassPerformanceData
        : growthPassPerformanceData.filter(p => p.pass === selectedPass);

    const filteredRawEvents = guestEventsData.filter(e => {
        const isGrowth = e.event_subtype === "growth_compass";
        if (selectedPass === "All Passes") return isGrowth;
        return isGrowth && e.page_url.includes(selectedPass.toLowerCase());
    });

    return (
        <GuestEventDashboard
            header={{
                title: "Growth Pass Analytics",
                description: "Monitor growth pass performance and engagement",
            }}
            filters={[
                {
                    label: "Date Range",
                    options: ["Last 24 Hours", "Last 7 Days", "Last 30 Days"],
                    value: dateRange,
                    onChange: setDateRange,
                },
                {
                    label: "Pass Type",
                    options: ["All Passes", ...growthPassData.map(p => p.title)],
                    value: selectedPass,
                    onChange: setSelectedPass,
                },
            ]}
            summary={growthPassSummary}
            trendTitle="GROWTH PASS CLICK TREND"
            trendData={growthPassTrendData}
            trendConfig={trendConfig}
            trendDataKeys={["clicks"]}
            performanceTitle="PASS PERFORMANCE"
            performanceData={filteredPerformance}
            performanceColumns={performanceColumns}
            detailTitle="PASS DETAIL"
            detailFields={(item) => [
                { label: "Pass Name", value: item.pass },
                { label: "Button Clicks", value: item.clicks },
            ]}
            detailFunnelSteps={() => []}
            rawEventsTitle="RAW EVENTS"
            rawEventsData={filteredRawEvents}
            rawEventsColumns={rawEventsColumns}
        />
    );
}