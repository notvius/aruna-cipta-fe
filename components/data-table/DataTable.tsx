"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Search, Trash2} from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: keyof TData | string, value: any) => void;
        updateRow: (rowIndex: number, newRow: TData) => void;
    }
}

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Generic reusable data‑table component.
 *
 * @template T – type of a single row of data.
 * @param data – array of rows.
 * @param columns – column definitions (TanStack `ColumnDef`).
 * @param caption – optional table caption.
 * @param filterColumn – optional key of the column to filter with the text input.
 * @param showFooter – whether to render a simple footer showing total rows.
 */
export interface DataTableProps<T extends Record<string, any>> {
    data: T[];
    columns: ColumnDef<T>[];
    caption?: string;
    filterColumn?: keyof T;
    showFooter?: boolean;
    onDataChange?: (newData: T[]) => void;
    searchPlaceholder?: string;
    enableGlobalSearch?: boolean;
    sortOptions?: { label: string; value: string }[];
    onDeleteSelected?: (selectedRows: T[]) => void;
    onAddNew?: () => void;
    onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    caption,
    filterColumn,
    showFooter = true,
    onDataChange,
    searchPlaceholder = "Search here...",
    enableGlobalSearch = true,
    sortOptions,
    onDeleteSelected,
    onAddNew,
    onRowClick,
}: DataTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([
        {
            id: "created_at",
            desc: true,
        }
    ]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        created_at: false,
    });
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            rowSelection,
            globalFilter,
        },
        meta: {
            updateData: (rowIndex: number, columnId: string, value: any) => {
                const newData = [...data];
                newData[rowIndex] = {
                    ...newData[rowIndex],
                    [columnId]: value,
                };
                onDataChange?.(newData);
            },
            updateRow: (rowIndex: number, newRow: T) => {
                const newData = [...data];
                newData[rowIndex] = newRow;
                onDataChange?.(newData);
            },
        },
    });

    // Helper: render a search filter
    const renderFilter = () => {
        if (enableGlobalSearch) {
            return (
                <InputGroup className="w-full md:max-w-sm">
                    <InputGroupAddon>
                        <Search className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                        placeholder={searchPlaceholder}
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </InputGroup>
            );
        }

        if (!filterColumn) return null;
        const column = table.getColumn(filterColumn as string);
        if (!column) return null;
        return (
            <Input
                placeholder={`Filter ${String(filterColumn)}...`}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(e) => column.setFilterValue(e.target.value)}
                className="w-full md:max-w-sm"
            />
        );
    };

    return (
        <div className="w-full">
            {/* ---- Controls (filter + column visibility) ---- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-2">
                <div className="flex flex-1 items-center gap-2">
                    {renderFilter()}
                    {onDeleteSelected && (
                        <Button
                            size="sm"
                            onClick={() => {
                                const selectedRows = table
                                    .getFilteredSelectedRowModel()
                                    .rows.map((row) => row.original);
                                onDeleteSelected(selectedRows);
                            }}
                            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                            className="flex items-center gap-2 bg-arcipta-primary hover:bg-arcipta-primary/90 text-white border-none shrink-0"
                        >
                            <Trash2 className="size-4" />
                            <span className="hidden sm:inline">Delete {table.getFilteredSelectedRowModel().rows.length > 0 && `(${table.getFilteredSelectedRowModel().rows.length})`}</span>
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    {sortOptions && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Sort By <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {sortOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => {
                                            const column = table.getColumn(option.value);
                                            if (column) {
                                                column.toggleSorting(column.getIsSorted() === "asc");
                                            }
                                        }}
                                    >
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((c) => c.getCanHide())
                                .map((c) => (
                                    <DropdownMenuCheckboxItem
                                        key={c.id}
                                        className="capitalize"
                                        checked={c.getIsVisible()}
                                        onCheckedChange={(v) => c.toggleVisibility(!!v)}
                                    >
                                        {c.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ---- Table ---- */}
            <div className="overflow-x-auto rounded-md border">
                <Table>
                    {caption && <TableCaption>{caption}</TableCaption>}
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h) => (
                                    <TableHead key={h.id}>
                                        {h.isPlaceholder
                                            ? null
                                            : flexRender(
                                                h.column.columnDef.header,
                                                h.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick?.(row.original)}
                                    className={onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ---- Footer (selection info + pagination) ---- */}
            {showFooter && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2">
                    <div className="text-muted-foreground text-sm order-2 md:order-1">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="order-1 md:order-2 w-full md:w-auto overflow-x-auto">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.previousPage();
                                        }}
                                        className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                                    <PaginationItem key={pageIndex}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.setPageIndex(pageIndex);
                                            }}
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.nextPage();
                                        }}
                                        className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )}
        </div>
    );
}
