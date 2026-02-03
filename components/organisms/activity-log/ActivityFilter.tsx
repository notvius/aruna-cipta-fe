"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

export function ActivityFilter({ table, globalFilter, setGlobalFilter }: { table: Table<any>, globalFilter: string, setGlobalFilter: (v: string) => void }) {
    const focusStyles = "focus-visible:ring-1 focus-visible:ring-arcipta-blue-primary/40 focus-visible:border-arcipta-blue-primary/40 transition-all";

    return (
        <div className="mt-8 mb-4 font-satoshi">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Search Activity</p>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search admin or action..." 
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className={`pl-10 h-10 rounded-lg border-slate-200 bg-white ${focusStyles}`}
                        />
                    </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Module</p>
                    <Select onValueChange={(val) => table.getColumn("target_type")?.setFilterValue(val === "all" ? "" : val)}>
                        <SelectTrigger className={`h-10 rounded-lg border-slate-200 bg-white ${focusStyles}`}>
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Modules</SelectItem>
                            <SelectItem value="Gallery">Gallery</SelectItem>
                            <SelectItem value="Article">Article</SelectItem>
                            <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-4 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Start Date</p>
                        <Input type="date" className={`h-10 rounded-lg border-slate-200 bg-white ${focusStyles}`} onChange={(e) => {
                            const current = table.getColumn("created_at")?.getFilterValue() as any || {};
                            table.getColumn("created_at")?.setFilterValue({ ...current, start: e.target.value });
                        }} />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">End Date</p>
                        <Input type="date" className={`h-10 rounded-lg border-slate-200 bg-white ${focusStyles}`} onChange={(e) => {
                            const current = table.getColumn("created_at")?.getFilterValue() as any || {};
                            table.getColumn("created_at")?.setFilterValue({ ...current, end: e.target.value });
                        }} />
                    </div>
                </div>

                <div className="md:col-span-2 flex gap-2">
                    <Button 
                        className="h-10 w-full bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 text-white rounded-lg shadow-sm" 
                        onClick={() => setGlobalFilter("")}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}