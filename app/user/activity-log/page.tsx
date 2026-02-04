"use client";

import * as React from "react";
import { 
    useReactTable, 
    getCoreRowModel, 
    getFilteredRowModel, 
    getPaginationRowModel,
    type ColumnDef,
    type ColumnFiltersState
} from "@tanstack/react-table";
import { ActivityCard } from "@/components/organisms/activity-log/ActivityCard";
import { ActivityFilter } from "@/components/organisms/activity-log/ActivityFilter";
import { ViewActivityLogModal } from "@/components/organisms/activity-log/ViewActivityLogModal";
import { activityLogsData } from "@/data/activity_log";
import { userData } from "@/data/users";
import { type ActivityLog } from "@/constants/activity_log";
import { 
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious 
} from "@/components/ui/pagination";

export default function ActivityLogPage() {
    const [selectedLog, setSelectedLog] = React.useState<ActivityLog | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");

    const columns = React.useMemo<ColumnDef<ActivityLog>[]>(() => [
        { id: "adminName", accessorFn: (row) => userData.find((u) => u.id === row.user_id)?.username || "" },
        { accessorKey: "action" },
        { accessorKey: "target_type", filterFn: (row, id, value) => value === "all" ? true : row.getValue(id) === value },
        { 
            accessorKey: "created_at",
            filterFn: (row, id, value: { start: string; end: string }) => {
                const date = new Date(row.getValue(id)).setHours(0,0,0,0);
                const start = value?.start ? new Date(value.start).setHours(0,0,0,0) : null;
                const end = value?.end ? new Date(value.end).setHours(0,0,0,0) : null;
                return (!start || date >= start) && (!end || date <= end);
            }
        }
    ], []);

    const sortedData = React.useMemo(() => [...activityLogsData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), []);

    const table = useReactTable({
        data: sortedData,
        columns,
        state: { columnFilters, globalFilter },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } }
    });

    return (
        <div className="w-full relative font-satoshi px-6"> 
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">Activity Log</h2>
                    <p className="text-sm text-muted-foreground">Monitor and audit all system activities and data changes.</p>
                </div>
            </div>

            <ActivityFilter table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

            <div className="mt-10 min-h-[400px]">
                {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row, index) => (
                        <ActivityCard 
                            key={row.original.id} 
                            log={row.original} 
                            isLast={index === table.getRowModel().rows.length - 1}
                            onViewDetail={(l) => { setSelectedLog(l); setIsModalOpen(true); }}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border">
                        <p className="text-muted-foreground italic text-sm">No activity logs found.</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-slate-100">
                <div className="text-muted-foreground text-sm font-medium order-2 md:order-1">
                    Showing {table.getRowModel().rows.length} row(s).
                </div>
                
                <div className="order-1 md:order-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); table.previousPage(); }}
                                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                                <PaginationItem key={pageIndex}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); table.setPageIndex(pageIndex); }}
                                        isActive={table.getState().pagination.pageIndex === pageIndex}
                                        className="cursor-pointer"
                                    >
                                        {pageIndex + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); table.nextPage(); }}
                                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            <ViewActivityLogModal open={isModalOpen} onOpenChange={setIsModalOpen} log={selectedLog} />
        </div>
    );
}