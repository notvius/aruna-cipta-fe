"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, RotateCcw } from "lucide-react";

interface Props<T extends Record<string, any>> {
    title: string;
    data: T[];
    columns: ColumnDef<T>[];
    onRowClick?: (row: T) => void;
}

export function PerformanceTable<T extends Record<string, any>>({ 
    title, 
    data, 
    columns, 
    onRowClick 
}: Props<T>) {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

    const onDateChange = (type: 'start' | 'end', value: string) => {
        setDateRange(prev => ({ ...prev, [type]: value }));
    };

    const onReset = () => {
        setGlobalFilter("");
        setDateRange({ start: "", end: "" });
    };

    const filteredData = React.useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = Object.values(item).some((val) =>
                String(val).toLowerCase().includes(globalFilter.toLowerCase())
            );

            let matchesDate = true;
            const dateKey = Object.keys(item).find(key => 
                key.toLowerCase().includes('date') || 
                key.toLowerCase().includes('at') || 
                key.toLowerCase().includes('published')
            );

            const targetDateStr = dateKey ? item[dateKey] : null;
            
            if (targetDateStr && (dateRange.start || dateRange.end)) {
                const itemDate = new Date(targetDateStr).getTime();
                if (dateRange.start) {
                    const start = new Date(dateRange.start).setHours(0, 0, 0, 0);
                    if (itemDate < start) matchesDate = false;
                }
                if (dateRange.end) {
                    const end = new Date(dateRange.end).setHours(23, 59, 59, 999);
                    if (itemDate > end) matchesDate = false;
                }
            }
            return matchesSearch && matchesDate;
        });
    }, [data, globalFilter, dateRange]);

    const focusStyles = "focus:ring-1 focus:ring-arcipta-blue-primary focus:border-arcipta-blue-primary transition-all duration-200";

    return (
        <Card className="w-full border-none shadow-sm bg-blue-50/40 rounded-3xl overflow-hidden font-satoshi transition-all duration-500 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1">
            <CardHeader className="px-6 pt-7 pb-0">
                <CardTitle className="text-xs font-bold font-orbitron text-blue-900 uppercase tracking-tight mb-3">
                    {title}
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row items-end gap-3 w-full">
                    <div className="flex-1 w-full space-y-1">
                        <p className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.2em] ml-0.5">Search Article</p>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-400" />
                            <input 
                                placeholder="Search here..." 
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className={`w-full pl-8 h-8 text-[10px] font-medium rounded-xl border border-blue-100 bg-white outline-none ${focusStyles}`}
                            />
                        </div>
                    </div>

                    <div className="flex-[1.5] w-full grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.2em] ml-0.5">Start Date</p>
                            <input 
                                type="date" 
                                value={dateRange.start} 
                                onChange={(e) => onDateChange('start', e.target.value)}
                                className={`w-full h-8 px-2 text-[10px] font-medium rounded-xl border border-blue-100 bg-white outline-none ${focusStyles}`} 
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.2em] ml-0.5">End Date</p>
                            <input 
                                type="date" 
                                value={dateRange.end} 
                                onChange={(e) => onDateChange('end', e.target.value)}
                                className={`w-full h-8 px-2 text-[10px] font-medium rounded-xl border border-blue-100 bg-white outline-none ${focusStyles}`} 
                            />
                        </div>
                    </div>

                    <button 
                        className="h-8 w-8 flex items-center justify-center bg-arcipta-blue-primary text-white rounded-xl transition-all active:scale-95 shadow-sm hover:bg-blue-600" 
                        onClick={onReset}
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                <div className="w-full overflow-x-auto [&_td]:text-[11px] [&_th]:text-[11px] [&_tr]:border-blue-100/50">
                    <DataTable
                        data={filteredData}
                        columns={columns}
                        showFooter={false}
                        enableGlobalSearch={false} 
                        onRowClick={onRowClick}
                    />
                </div>
            </CardContent>
        </Card>
    );
}