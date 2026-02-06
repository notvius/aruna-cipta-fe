"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { type AnalyticsSummaryItem } from "@/constants/guest_events";
import { 
    Eye, 
    PlayCircle, 
    CheckCircle2, 
    BarChart3, 
    TrendingUp, 
    TrendingDown,
    MousePointerClick,
    Ticket
} from "lucide-react";

interface Props {
    items: AnalyticsSummaryItem[];
}

export function DashboardSummary({ items }: Props) {
    const gridCols = items.length <= 2 
        ? "grid-cols-1 md:grid-cols-2" 
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

    const getVariant = (index: number) => {
        const variants = [
            { bg: "bg-blue-50/40", iconColor: "text-blue-600", badge: "bg-blue-100/50 text-blue-700", hover: "hover:bg-blue-50" },
            { bg: "bg-orange-50/40", iconColor: "text-orange-600", badge: "bg-orange-100/50 text-orange-700", hover: "hover:bg-orange-50" },
            { bg: "bg-blue-50/40", iconColor: "text-blue-600", badge: "bg-blue-100/50 text-blue-700", hover: "hover:bg-blue-50" },
            { bg: "bg-orange-50/40", iconColor: "text-orange-600", badge: "bg-orange-100/50 text-orange-700", hover: "hover:bg-orange-50" },
        ];
        return variants[index % variants.length];
    };

    const getIcon = (type: string, colorClass: string) => {
        const iconClass = `h-5 w-5 ${colorClass}`;
        switch (type) {
            case "eye": return <Eye className={iconClass} />;
            case "play": return <PlayCircle className={iconClass} />;
            case "check": return <CheckCircle2 className={iconClass} />;
            case "chart": return <BarChart3 className={iconClass} />;
            case "mouse": return <MousePointerClick className={iconClass} />;
            case "ticket": return <Ticket className={iconClass} />;
            default: return <Eye className={iconClass} />;
        }
    };

    return (
        <div className={`grid ${gridCols} gap-6 w-full font-satoshi`}>
            {items.map((item, index) => {
                const variant = getVariant(index);
                const isPositive = item.trend.startsWith('+') || item.trend.includes('Best');
                
                return (
                    <Card 
                        key={index} 
                        className={`group border-none shadow-sm rounded-3xl transition-all duration-500 cursor-default ${variant.bg} ${variant.hover} hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1`}
                    >
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-white shadow-sm group-hover:shadow-md transition-all duration-500">
                                    {getIcon(item.iconType, variant.iconColor)}
                                </div>
                                
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold border border-white/50 ${variant.badge} transition-all duration-500 group-hover:bg-white`}>
                                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {item.trend}
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                    {item.label}
                                </p>
                                <h3 className="text-3xl font-black text-slate-900 font-orbitron tracking-tighter leading-none uppercase">
                                    {item.value}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}