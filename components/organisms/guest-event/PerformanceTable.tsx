"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceTableProps<T extends Record<string, any>> {
    title: string;
    data: T[];
    columns: ColumnDef<T>[];
    onRowClick?: (row: T) => void;
}

export function PerformanceTable<T extends Record<string, any>>({
    title,
    data,
    columns,
    onRowClick,
}: PerformanceTableProps<T>) {
    return (
        <Card className="w-full relative overflow-hidden group transition-all duration-300 hover:border-arcipta-orange/50">
            {/* Hover Animated Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-arcipta-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable
                    data={data}
                    columns={columns}
                    onRowClick={onRowClick}
                    showFooter={true}
                />
                {onRowClick && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                        * Click row to view detail
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
