"use client";

import * as React from "react";
import { DashboardSummary } from "./DashboardSummary";
import { TrendChart } from "./TrendChart";
import { PerformanceTable } from "./PerformanceTable";
import { DetailCard } from "./DetailCard";
import { RawEventsTable } from "./RawEventsTable";
import { SummaryItem, TrendData, DashboardFilter } from "./types";
import { ColumnDef } from "@tanstack/react-table";
import { ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Download} from "lucide-react";

interface GuestEventDashboardProps {
    header: {
        title: string;
        description: string;
    };
    filters: DashboardFilter[];
    summary: SummaryItem[];
    trendTitle: string;
    trendData: TrendData[];
    trendConfig: ChartConfig;
    trendDataKeys: string[];
    performanceTitle?: string;
    performanceData?: any[];
    performanceColumns?: ColumnDef<any>[];
    detailTitle: string;
    detailFields: (item: any) => { label: string; value: any }[];
    detailFunnelSteps?: (item: any) => { label: string; value: any }[];
    rawEventsTitle: string;
    rawEventsData: any[];
    rawEventsColumns: ColumnDef<any>[];
    layoutVariant?: 'default' | 'whatsapp';
}

export function GuestEventDashboard({
    header,
    filters,
    summary,
    trendTitle,
    trendData,
    trendConfig,
    trendDataKeys,
    performanceTitle,
    performanceData,
    performanceColumns,
    detailTitle,
    detailFields,
    detailFunnelSteps,
    rawEventsTitle,
    rawEventsData,
    rawEventsColumns,
    layoutVariant = 'default',
}: GuestEventDashboardProps) {
    const [selectedItem, setSelectedItem] = React.useState<any>(null);

    return (
        <div className="flex flex-1 flex-col gap-8 w-full overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
                        {header.title}
                    </h1>
                    <p className="text-muted-foreground font-light text-base lg:text-lg max-w-2xl">
                        {header.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {filters.map((filter, idx) => (
                        <Select
                            key={idx}
                            value={filter.value}
                            onValueChange={filter.onChange}
                        >
                            <SelectTrigger className="w-[180px] bg-white border-slate-200 hover:border-arcipta-orange transition-colors rounded-xl h-11">
                                <SelectValue placeholder={filter.label} />
                            </SelectTrigger>
                            <SelectContent>
                                {filter.options.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}

                    <Button
                        className="bg-arcipta-primary hover:bg-arcipta-orange-dark text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-orange-500/20 gap-2 uppercase tracking-wider text-xs"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {layoutVariant === 'whatsapp' ? (
                <>
                    {/* WhatsApp Top Row: Summary + Trend */}
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8 min-h-0">
                        <div className="xl:col-span-1 h-full">
                            <DashboardSummary items={summary} />
                        </div>
                        <div className="xl:col-span-3 min-w-0 h-full">
                            <TrendChart
                                title={trendTitle}
                                data={trendData}
                                config={trendConfig}
                                dataKeys={trendDataKeys}
                            />
                        </div>
                    </div>

                    {/* WhatsApp Bottom Row: Raw Events + Detail */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="xl:col-span-2 w-full overflow-hidden flex flex-col">
                            <RawEventsTable
                                title={rawEventsTitle}
                                data={rawEventsData}
                                columns={rawEventsColumns}
                                onRowClick={(row) => setSelectedItem(row)}
                            />
                        </div>
                        <div className="xl:col-span-1 min-w-0 h-full flex flex-col">
                            <DetailCard
                                title={detailTitle}
                                item={selectedItem}
                                fields={(item) => {
                                    if (item.ip_address || item.created_at || item.event_subtype) {
                                        return [
                                            { label: "TIMESTAMP", value: item.created_at instanceof Date ? item.created_at.toLocaleString('en-GB') : (item.created_at || item.time) },
                                            { label: "EVENT CATEGORY", value: item.event_type },
                                            { label: "EVENT ACTION", value: item.event_subtype || item.target },
                                            { label: "NETWORK IP", value: item.ip_address || "Unknown" },
                                            { label: "BROWSER / OS", value: item.user_agent || "Unknown" },
                                            { label: "SOURCE URL", value: item.page_url },
                                        ];
                                    }
                                    return detailFields(item);
                                }}
                                funnelSteps={(item) => {
                                    if (item.ip_address || item.created_at || item.event_subtype) return [];
                                    return detailFunnelSteps ? detailFunnelSteps(item) : [];
                                }}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Default Summary Section */}
                    <div className="space-y-6">
                        <DashboardSummary items={summary} />
                    </div>

                    {/* Default Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 min-h-0">
                        <div className="xl:col-span-2 min-w-0 h-full">
                            <TrendChart
                                title={trendTitle}
                                data={trendData}
                                config={trendConfig}
                                dataKeys={trendDataKeys}
                            />
                        </div>
                        <div className="xl:col-span-1 min-w-0 h-full">
                            <DetailCard
                                title={detailTitle}
                                item={selectedItem}
                                fields={(item) => {
                                    if (item.ip_address || item.created_at || item.event_subtype) {
                                        return [
                                            { label: "TIMESTAMP", value: item.created_at instanceof Date ? item.created_at.toLocaleString('en-GB') : (item.created_at || item.time) },
                                            { label: "EVENT CATEGORY", value: item.event_type },
                                            { label: "EVENT ACTION", value: item.event_subtype || item.target },
                                            { label: "NETWORK IP", value: item.ip_address || "Unknown" },
                                            { label: "BROWSER / OS", value: item.user_agent || "Unknown" },
                                            { label: "SOURCE URL", value: item.page_url },
                                        ];
                                    }
                                    return detailFields(item);
                                }}
                                funnelSteps={(item) => {
                                    if (item.ip_address || item.created_at || item.event_subtype) return [];
                                    return detailFunnelSteps ? detailFunnelSteps(item) : [];
                                }}
                            />
                        </div>
                    </div>

                    {/* Default Tables Section */}
                    <div className={`grid grid-cols-1 ${performanceData && performanceColumns ? 'lg:grid-cols-2' : ''} gap-6 lg:gap-8 w-full`}>
                        {performanceData && performanceColumns && (
                            <div className="w-full overflow-hidden">
                                <PerformanceTable
                                    title={performanceTitle || ""}
                                    data={performanceData}
                                    columns={performanceColumns}
                                    onRowClick={(row) => setSelectedItem(row)}
                                />
                            </div>
                        )}

                        <div className="w-full overflow-hidden">
                            <RawEventsTable
                                title={rawEventsTitle}
                                data={rawEventsData}
                                columns={rawEventsColumns}
                                onRowClick={(row) => setSelectedItem(row)}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
