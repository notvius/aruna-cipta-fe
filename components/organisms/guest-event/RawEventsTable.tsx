"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";

interface RawEventsTableProps<T extends Record<string, any>> {
    title: string;
    description?: string;
    data: T[];
    columns: ColumnDef<T>[];
    onRowClick?: (row: T) => void;
}

export function RawEventsTable<T extends Record<string, any>>({
    title,
    description,
    data,
    columns,
    onRowClick,
}: RawEventsTableProps<T>) {
    return (
        <Card className="w-full relative overflow-hidden group transition-all duration-300 hover:border-arcipta-orange/50">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-arcipta-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <DataTable
                    data={data}
                    columns={columns}
                    showFooter={true}
                    enableGlobalSearch={true}
                    searchPlaceholder="Filter events..."
                    onRowClick={onRowClick}
                />
            </CardContent>
        </Card>
    );
}
