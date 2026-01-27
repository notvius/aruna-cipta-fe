"use client";

import * as React from "react";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import {
    serviceSummary,
    serviceTrendData,
    servicePerformanceData,
} from "@/data/guest_event_analytics";
import { guestEventsData } from "@/data/guest_event";
import { servicesData } from "@/data/services";
import { ColumnDef } from "@tanstack/react-table";
import { ChartConfig } from "@/components/ui/chart";

export default function ServiceAnalyticsPage() {
    const [dateRange, setDateRange] = React.useState("Last 7 Days");
    const [selectedService, setSelectedService] = React.useState("All Services");

    const performanceColumns: ColumnDef<any>[] = [
        { accessorKey: "service", header: "Service Name" },
        { accessorKey: "views", header: "Total Button Clicks" },
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
        views: { label: "Button Clicks", color: "#FF6B35" },
    } satisfies ChartConfig;

    const filteredPerformance = selectedService === "All Services"
        ? servicePerformanceData
        : servicePerformanceData.filter(p => p.service === selectedService);

    const filteredRawEvents = guestEventsData.filter(e => {
        const isService = e.event_subtype === "service";
        if (selectedService === "All Services") return isService;
        return isService && e.page_url.toLowerCase().includes(selectedService.toLowerCase().replace(/\s+/g, '-'));
    });

    return (
        <GuestEventDashboard
            header={{
                title: "Service Analytics",
                description: "Track performance of your service categories",
            }}
            filters={[
                {
                    label: "Date Range",
                    options: ["Last 24 Hours", "Last 7 Days", "Last 30 Days"],
                    value: dateRange,
                    onChange: setDateRange,
                },
                {
                    label: "Service",
                    options: ["All Services", ...servicesData.map(s => s.title)],
                    value: selectedService,
                    onChange: setSelectedService,
                },
            ]}
            summary={serviceSummary}
            trendTitle="SERVICE CLICK TREND"
            trendData={serviceTrendData}
            trendConfig={trendConfig}
            trendDataKeys={["views"]}
            performanceTitle="SERVICE PERFORMANCE"
            performanceData={filteredPerformance}
            performanceColumns={performanceColumns}
            detailTitle="SERVICE DETAIL"
            detailFields={(item) => [
                { label: "Service", value: item.service },
                { label: "Button Clicks", value: item.views },
            ]}
            detailFunnelSteps={() => []}
            rawEventsTitle="RAW EVENTS"
            rawEventsData={filteredRawEvents}
            rawEventsColumns={rawEventsColumns}
        />
    );
}