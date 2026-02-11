"use client";

import * as React from "react";
import Cookies from "js-cookie";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState
} from "@tanstack/react-table";
import { ActivityCard } from "@/components/organisms/activity-log/ActivityCard";
import { ActivityFilter } from "@/components/organisms/activity-log/ActivityFilter";
import { ViewActivityLogModal } from "@/components/organisms/activity-log/ViewActivityLogModal";
import { type ActivityLog } from "@/constants/activity_log";
import { type User } from "@/constants/users";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from "@/components/ui/pagination";
import AlertError2 from "@/components/alert-error-2";

export default function ActivityLogPage() {
    const [activityLogs, setActivityLogs] = React.useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [viewItem, setViewItem] = React.useState<ActivityLog | null>(null);
    const [isViewOpen, setIsViewOpen] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        setIsLoading(true);
        try {
            const [logsRes, usersRes] = await Promise.all([
                fetch(`${baseUrl}/activity-log`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }),
                fetch(`${baseUrl}/user`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
            ]);

            const logsData = await logsRes.json();
            const usersData = await usersRes.json();

            const actualLogs = Array.isArray(logsData) ? logsData : logsData.data || [];
            const actualUsers = Array.isArray(usersData) ? usersData : usersData.data || [];

            const mappedLogs = actualLogs.map((log: ActivityLog) => {
                const foundUser = actualUsers.find((u: User) => Number(u.id) === Number(log.user_id));
                return { ...log, user: foundUser || log.user };
            });

            setActivityLogs(mappedLogs);
        } catch (err) {
            setError("Failed to fetch activity logs");
            setTimeout(() => setError(null), 4000);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    const columns = React.useMemo<ColumnDef<ActivityLog>[]>(() => [
        {
            id: "adminName",
            accessorFn: (row) => row.user?.username || "System"
        },
        { accessorKey: "action" },
        {
            accessorKey: "target_type",
            filterFn: (row, id, value) => value === "all" ? true : row.getValue(id) === value
        },
        {
            accessorKey: "created_at",
            filterFn: (row, id, value: { start: string; end: string }) => {
                const date = new Date(row.getValue(id)).setHours(0, 0, 0, 0);
                const start = value?.start ? new Date(value.start).setHours(0, 0, 0, 0) : null;
                const end = value?.end ? new Date(value.end).setHours(23, 59, 59, 999) : null;
                return (!start || date >= start) && (!end || date <= end);
            }
        }
    ], []);

    const table = useReactTable({
        data: activityLogs,
        columns,
        state: { 
            columnFilters, 
            globalFilter,
            pagination 
        },
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    const renderPaginationItems = () => {
        const items = [];
        const maxVisible = 3;

        items.push(
            <PaginationItem key="first">
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); table.setPageIndex(0); }} isActive={currentPage === 0}>1</PaginationLink>
            </PaginationItem>
        );

        if (currentPage > 2) {
            items.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
        }

        for (let i = Math.max(1, currentPage - 1); i <= Math.min(pageCount - 2, currentPage + 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); table.setPageIndex(i); }} isActive={currentPage === i}>{i + 1}</PaginationLink>
                </PaginationItem>
            );
        }

        if (currentPage < pageCount - 3) {
            items.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
        }

        if (pageCount > 1) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); table.setPageIndex(pageCount - 1); }} isActive={currentPage === pageCount - 1}>{pageCount}</PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div className="w-full relative font-jakarta px-6 pb-10">
            {error && (
                <div className="fixed top-6 right-6 z-[200]">
                    <AlertError2 message={error} onClose={() => setError(null)} />
                </div>
            )}

            <div className="mb-4 space-y-1 pt-4">
                <h2 className="text-2xl font-bold font-outfit text-slate-900 uppercase">
                    Activity Logs
                </h2>
                <p className="text-sm text-muted-foreground">
                    Monitor and audit all system activities and data changes.
                </p>
            </div>

            <ActivityFilter
                table={table}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />

            <div className="mt-10 min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arcipta-blue-primary"></div>
                    </div>
                ) : table.getRowModel().rows.length > 0 ? (
                    <div className="flex flex-col">
                        {table.getRowModel().rows.map((row, index) => (
                            <ActivityCard
                                key={row.original.id}
                                log={row.original}
                                isLast={index === table.getRowModel().rows.length - 1}
                                onViewDetail={(l) => {
                                    setViewItem(l);
                                    setIsViewOpen(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border">
                        <p className="text-muted-foreground italic text-sm">No activity logs found.</p>
                    </div>
                )}
            </div>

            {pageCount > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-t border-slate-100 mt-8">
                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] order-2 md:order-1">
                        Page {currentPage + 1} of {pageCount} — Total {activityLogs.length} Activities
                    </div>

                    <div className="order-1 md:order-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); if (table.getCanPreviousPage()) table.previousPage(); }}
                                        className={!table.getCanPreviousPage() ? "pointer-events-none opacity-40" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                
                                {renderPaginationItems()}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); if (table.getCanNextPage()) table.nextPage(); }}
                                        className={!table.getCanNextPage() ? "pointer-events-none opacity-40" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )}

            {viewItem && (
                <ViewActivityLogModal
                    open={isViewOpen}
                    onOpenChange={setIsViewOpen}
                    log={viewItem}
                />
            )}
        </div>
    );
}