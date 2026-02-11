"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ActivityLog } from "@/constants/activity_log";
import { cn } from "@/lib/utils";

interface ViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    log: ActivityLog | null;
}

export function ViewActivityLogModal({ open, onOpenChange, log }: ViewProps) {
    if (!log) return null;

    const getStatusColor = (action: string) => {
        const a = action.toLowerCase();
        if (a.includes("create")) return "bg-arcipta-blue-primary";
        if (a.includes("update")) return "bg-amber-500";
        if (a.includes("delete")) return "bg-red-500";
        return "bg-slate-500";
    };

    const formatFullDate = (date: any) => {
        if (!date) return "—";
        return new Date(date).toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "long",
            year: "numeric"
        }) + " WIB";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] font-satoshi p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold font-orbitron uppercase text-slate-900">
                        Activity Log Details
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[85vh] w-full">
                    <div className="p-6 space-y-8">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm bg-slate-50 border-slate-200 text-slate-600 font-orbitron font-bold text-lg"
                            )}>
                                {log.user?.username?.charAt(0).toUpperCase() || "S"}
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-slate-900">
                                    {log.user?.username || "System"}
                                </h2>
                                <div className="flex gap-2">
                                    <Badge className={cn("uppercase text-[9px] tracking-widest", getStatusColor(log.action))}>
                                        {log.action}
                                    </Badge>
                                    <Badge variant="outline" className="uppercase text-[9px] tracking-widest text-slate-500 border-slate-200">
                                        {log.target_type}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Target Context</p>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">Target ID</span>
                                                <span className="text-xs font-mono font-bold text-slate-700">{log.target_id}</span>
                                            </div>
                                            {log.target_uuid && (
                                                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Target UUID</span>
                                                    <span className="text-[10px] font-mono text-slate-500">{log.target_uuid}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1 pt-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Connection Details</p>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">IP Address</span>
                                                <span className="text-xs font-mono font-bold text-slate-700">{log.ip_address}</span>
                                            </div>
                                            <div className="space-y-2 border-t border-slate-100 pt-3">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">User Agent</p>
                                                <p className="text-[10px] leading-relaxed text-slate-500 font-mono break-all line-clamp-3">
                                                    {log.user_agent}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 mt-2">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Created At</p>
                                            <p className="text-xs font-semibold text-slate-700">{formatFullDate(log.created_at)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Last Sync / Update</p>
                                            <p className="text-xs font-semibold text-slate-700">{formatFullDate(log.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex justify-end">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Close Details
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
