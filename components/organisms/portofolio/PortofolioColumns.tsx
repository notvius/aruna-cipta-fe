"use client";

import * as React from "react";
import { Portofolio } from "@/constants/portofolios";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Service } from "@/constants/services";
import { ViewPortofolioModal } from "./ViewPortofolioModal";
import { EditPortofolioModal } from "./EditPortofolioModal";

export const getPortofolioColumns = (
    services: Service[]
): ColumnDef<Portofolio>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) =>
                    row.toggleSelected(!!value)
                }
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "thumbnail",
        header: "Thumbnail",
        cell: ({ row }) => (
            <img
                src={row.getValue("thumbnail")}
                alt={row.getValue("title")}
                className="rounded-md object-cover h-10 w-16"
            />
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground whitespace-normal break-words">
                {row.getValue("title")}
            </div>
        ),
    },
    {
        accessorKey: "client_name",
        header: "Client Name",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground whitespace-normal break-words">
                {row.getValue("client_name")}
            </div>
        ),
    },
    {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.getValue("year")}
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const rawCategoryIds = row.getValue("category") as (number | string)[];

            if (!Array.isArray(rawCategoryIds) || rawCategoryIds.length === 0) {
                return <span className="text-muted-foreground">-</span>;
            }

            const names = rawCategoryIds
                .map(id => {
                    const numericId = Number(id);
                    return services.find(s => Number(s.id) === numericId)?.title;
                })
                .filter(Boolean)
                .join(", ");

            return (
                <Badge variant="secondary" className="font-normal">
                    {names || "Uncategorized"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        id: "actions",
        header: "Action",
        size: 100,
        enableHiding: false,
        cell: ({ row, table }) => {
            const portofolio = row.original;
            return (
                <div className="flex items-center gap-1">
                    <ViewPortofolioModal portofolio={portofolio} />
                    <EditPortofolioModal
                        portofolio={portofolio}
                        onSave={(updated) =>
                            table.options.meta?.updateRow(
                                row.index,
                                updated
                            )
                        }
                    />
                </div>
            );
        },
    },
];
