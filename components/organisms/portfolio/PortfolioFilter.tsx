"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function PortfolioFilter({
    globalFilter,
    setGlobalFilter,
    catFilter,
    onCatChange,
    dateRange = { start: "", end: "" },
    onDateChange,
    onReset,
    services = []
}: any) {
    const focusStyles = "focus-visible:ring-1 focus-visible:ring-arcipta-blue-primary/40 focus-visible:border-arcipta-blue-primary/40 transition-all";
    const elementHeight = "h-10";

    return (
        <div className="mt-8 mb-4 font-satoshi w-full bg-white relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end w-full">

                <div className="md:col-span-3 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Search Portfolio</p>
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-arcipta-blue-primary transition-colors" />
                        <Input
                            placeholder="Search title or client..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className={cn(
                                "pl-11 rounded-lg border-slate-200 bg-white",
                                elementHeight,
                                focusStyles
                            )}
                        />
                    </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Category</p>
                    <Select value={catFilter} onValueChange={onCatChange}>
                        <SelectTrigger className={cn(
                            "rounded-lg border-slate-200 bg-white",
                            elementHeight,
                            focusStyles
                        )}>
                            <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-xl rounded-xl font-satoshi">
                            <SelectItem value="all" className="cursor-pointer">All Services</SelectItem>
                            {services.map((s: any) => (
                                <SelectItem key={s.id} value={s.id.toString()} className="cursor-pointer">
                                    {s.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-4 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Start Date</p>
                        <Input
                            type="date"
                            value={dateRange?.start || ""}
                            className={cn(
                                "rounded-lg border-slate-200 bg-white font-semibold",
                                elementHeight,
                                focusStyles
                            )}
                            onChange={(e) => onDateChange('start', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">End Date</p>
                        <Input
                            type="date"
                            value={dateRange?.end || ""}
                            className={cn(
                                "rounded-lg border-slate-200 bg-white font-semibold",
                                elementHeight,
                                focusStyles
                            )}
                            onChange={(e) => onDateChange('end', e.target.value)}
                        />
                    </div>
                </div>

                <div className="md:col-span-2 flex gap-2">
                    <Button
                        className={`${elementHeight} w-full bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 text-white rounded-lg shadow-sm transition-all active:scale-95`}
                        onClick={onReset}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
