"use client";

import * as React from "react";
import { DashboardSummary } from "./DashboardSummary";
import { TrendChart } from "./TrendChart";
import { PerformanceTable } from "./PerformanceTable";
import { RawEventsTable } from "./RawEventsTable";
import { AnalyticsDetailModal } from "./AnalyticsDetailModal";
import { type AnalyticsSummaryItem, type TrendData } from "@/constants/guest_events";
import { ColumnDef } from "@tanstack/react-table";
import { type ChartConfig } from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Mouse } from "lucide-react";

interface Props {
    header: { title: string; description: string };
    summary: AnalyticsSummaryItem[];
    trendTitle: string;
    trendData: TrendData[];
    trendConfig: ChartConfig;
    trendDataKeys: string[];
    performanceTitle: string;
    performanceData: any[];
    performanceColumns: ColumnDef<any>[];
    rawEventsTitle: string;
    rawEventsData: any[];
    rawEventsColumns: ColumnDef<any>[];
}

export function GuestEventDashboard({
    header,
    summary,
    trendTitle,
    trendData,
    trendConfig,
    trendDataKeys,
    performanceTitle,
    performanceData,
    performanceColumns,
    rawEventsTitle,
    rawEventsData,
    rawEventsColumns,
}: Props) {
    const [selectedDetail, setSelectedDetail] = React.useState<any>(null);
    const [timeRange, setTimeRange] = React.useState("1w");

    const arciptaFocus = "focus:ring-1 focus:ring-arcipta-blue-primary focus:border-arcipta-blue-primary hover:border-arcipta-blue-primary transition-all duration-200";

    return (
        <div className="flex flex-1 flex-col gap-8 w-full overflow-hidden font-satoshi px-6 pb-10 text-slate-900">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none uppercase font-orbitron">
                        {header.title}
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                        {header.description}
                    </p>
                </div>

                <div className="flex flex-col gap-1.5 min-w-[160px]">
                    <p className="text-[9px] font-bold text-slate-400 uppercase ml-0.5 tracking-widest">Time Range</p>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className={`h-9 rounded-lg border-slate-200 bg-white text-[11px] font-medium outline-none ${arciptaFocus}`}>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                <SelectValue placeholder="Select range" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden">
                            <SelectItem value="1d" className="text-xs font-medium focus:bg-arcipta-blue-primary/5 focus:text-arcipta-blue-primary cursor-pointer">1 Day</SelectItem>
                            <SelectItem value="1w" className="text-xs font-medium focus:bg-arcipta-blue-primary/5 focus:text-arcipta-blue-primary cursor-pointer">1 Week</SelectItem>
                            <SelectItem value="1m" className="text-xs font-medium focus:bg-arcipta-blue-primary/5 focus:text-arcipta-blue-primary cursor-pointer">1 Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DashboardSummary items={summary} />

            <div className="w-full">
                <TrendChart
                    title={trendTitle}
                    data={trendData}
                    dataKeys={trendDataKeys}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start">
                <PerformanceTable
                    title={performanceTitle}
                    data={performanceData}
                    columns={performanceColumns}
                    onRowClick={(row) => setSelectedDetail(row)}
                />
                <RawEventsTable
                    title={rawEventsTitle}
                    data={rawEventsData}
                    columns={rawEventsColumns}
                    onRowClick={(row) => setSelectedDetail(row)}
                />
            </div>

            <AnalyticsDetailModal
                open={!!selectedDetail}
                onOpenChange={(open) => !open && setSelectedDetail(null)}
                title="Detailed Analytics Information"
                data={selectedDetail}
            />
        </div>
    );
}