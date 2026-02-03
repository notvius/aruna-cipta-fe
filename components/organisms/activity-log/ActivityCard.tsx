"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Globe, Hash, Info } from "lucide-react";
import { type ActivityLog } from "@/constants/activity_log";
import { userData } from "@/data/users";

export function ActivityCard({ log, isLast, onViewDetail }: { log: ActivityLog; isLast: boolean; onViewDetail: (log: ActivityLog) => void }) {
    const user = userData.find((u) => u.id === log.user_id);
    const date = new Date(log.created_at);
    
    const getStatusColor = (action: string) => {
        switch (action.toLowerCase()) {
            case "created": return "bg-arcipta-blue-primary";
            case "updated": return "bg-amber-500";
            case "deleted": return "bg-red-500";
            default: return "bg-slate-400";
        }
    };

    return (
        <div className="flex gap-6 min-h-[100px] group/item font-satoshi">
            {/* Left: Time & Year */}
            <div className="w-24 pt-1 flex flex-col items-end shrink-0">
                <span className="text-sm font-bold text-slate-900 leading-none">
                    {date.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tight mt-1 text-right">
                    {date.toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            </div>

            {/* Timeline Line */}
            <div className="flex flex-col items-center shrink-0">
                <div className={`h-4 w-4 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover/item:scale-125 ${getStatusColor(log.action)}`} />
                {!isLast && <div className="w-0.5 h-full bg-slate-100 -mt-1 group-hover/item:bg-slate-200 transition-colors" />}
            </div>

            {/* Card Content */}
            <motion.div className="flex-1 pb-8 cursor-pointer" onClick={() => onViewDetail(log)}>
                <div className="bg-white border border-border p-4 rounded-2xl hover:border-arcipta-blue-primary/30 hover:shadow-md transition-all group relative">
                    <div className="flex justify-between items-start gap-4">
                        <p className="text-sm leading-relaxed flex-1 text-slate-600">
                            <span className="font-bold text-slate-900">{user?.username || "System"}</span>
                            <span> {log.action.toLowerCase() === 'created' ? 'created a new' : log.action.toLowerCase() === 'deleted' ? 'deleted an' : 'updated an'} entry in </span>
                            <span className="font-bold text-slate-900">{log.target_type}</span> module.
                        </p>
                        <Info className="h-4 w-4 text-slate-300 group-hover:text-arcipta-blue-primary transition-colors shrink-0 mt-1" />
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> ID: {log.target_id}</span>
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {log.ip_address}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}