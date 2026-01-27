"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/activity-log/ActivityLogColumns";
import { activityLogsData } from "@/data/activity_log";

export default function ActivityLogPage() {
    const sortOptions = [
        { label: "Timestamp", value: "created_at" },
        { label: "User", value: "user_id" },
        { label: "Action", value: "action" },
        { label: "Module", value: "target_type" },
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Activity Log</h2>
                </div>
            </div>

            <DataTable
                data={activityLogsData}
                columns={columns}
                sortOptions={sortOptions}
                searchPlaceholder="Search logs..."
                enableGlobalSearch={true}
                showFooter={true}
            />
        </div>
    );
}