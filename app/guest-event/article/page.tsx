"use client";

import * as React from "react";
import { GuestEventDashboard } from "@/components/organisms/guest-event/GuestEventDashboard";
import {
    articleSummary,
    articleTrendData,
    articlePerformanceData,
    ArticlePerformance
} from "@/data/guest_event_analytics";
import { guestEventsData } from "@/data/guest_event";
import { articlesData } from "@/data/articles";
import { ColumnDef } from "@tanstack/react-table";
import { ChartConfig } from "@/components/ui/chart";

export default function ArticleAnalyticsPage() {
    const [dateRange, setDateRange] = React.useState("Last 7 Days");
    const [selectedArticle, setSelectedArticle] = React.useState("All Articles");

    const performanceColumns: ColumnDef<ArticlePerformance>[] = [
        {
            accessorKey: "title",
            header: "Article Title",
        },
        {
            accessorKey: "views",
            header: "Views",
        },
        {
            accessorKey: "start",
            header: "Start",
        },
        {
            accessorKey: "finish",
            header: "Finish",
        },
        {
            accessorKey: "completion",
            header: "Completion",
        },
    ];

    const rawEventsColumns: ColumnDef<any>[] = [
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => row.original.created_at ? (row.original.created_at as Date).toLocaleString() : "N/A",
        },
        {
            accessorKey: "event_type",
            header: "Event Type",
        },
        {
            accessorKey: "event_subtype",
            header: "Subtype",
        },
        {
            accessorKey: "ip_address",
            header: "IP Address",
        },
        {
            accessorKey: "user_agent",
            header: "User Agent",
        },
        {
            accessorKey: "page_url",
            header: "Page URL",
        },
    ];

    const trendConfig = {
        views: {
            label: "Views",
            color: "#FF6B35",
        },
        start: {
            label: "Read Start",
            color: "#FF8C42",
        },
        finish: {
            label: "Read Finish",
            color: "#D4451C",
        },
    } satisfies ChartConfig;

    const filteredPerformance = selectedArticle === "All Articles"
        ? articlePerformanceData
        : articlePerformanceData.filter(p => p.title === selectedArticle);

    const filteredRawEvents = guestEventsData.filter(e => {
        const isArticle = e.event_subtype.includes("article");
        if (selectedArticle === "All Articles") return isArticle;

        // Match article title with page URL (e.g. "CMS Security" matches "/article/cms-security")
        const slug = selectedArticle.toLowerCase().replace(/\s+/g, '-');
        return isArticle && e.page_url.includes(slug);
    });

    return (
        <GuestEventDashboard
            header={{
                title: "Article Analytics",
                description: "Track how visitors read and interact with articles",
            }}
            filters={[
                {
                    label: "Date Range",
                    options: ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "Custom Range"],
                    value: dateRange,
                    onChange: setDateRange,
                },
                {
                    label: "Article",
                    options: ["All Articles", ...articlesData.map(a => a.title)],
                    value: selectedArticle,
                    onChange: setSelectedArticle,
                },
            ]}
            summary={articleSummary}
            trendTitle="ARTICLE READS TREND"
            trendData={articleTrendData}
            trendConfig={trendConfig}
            trendDataKeys={["views", "start", "finish"]}
            performanceTitle="TOP ARTICLES PERFORMANCE"
            performanceData={filteredPerformance}
            performanceColumns={performanceColumns}
            detailTitle="ARTICLE DETAIL"
            detailFields={(item) => [
                { label: "Title", value: item.title },
                { label: "URL", value: item.url },
                { label: "Published At", value: item.publishedAt },
                { label: "Views", value: item.views },
                { label: "Read Start", value: item.start },
                { label: "Read Finish", value: item.finish },
                { label: "Completion", value: item.completion },
            ]}
            detailFunnelSteps={(item) => [
                { label: "View", value: item.views },
                { label: "Start", value: item.start },
                { label: "Finish", value: item.finish },
            ]}
            rawEventsTitle="RAW EVENTS"
            rawEventsData={filteredRawEvents}
            rawEventsColumns={rawEventsColumns}
        />
    );
}