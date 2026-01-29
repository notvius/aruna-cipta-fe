"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SummaryItem } from "./types";
import { Eye, Play, CheckCircle2, BarChart3, TrendingUp } from "lucide-react";

interface DashboardSummaryProps {
    items: SummaryItem[];
}

const defaultIcons: Record<string, any> = {
    "Total Views": Eye,
    "Read Start": Play,
    "Read Finish": CheckCircle2,
    "Avg Completion": BarChart3,
};

export function DashboardSummary({ items }: DashboardSummaryProps) {
    return (
        <div className={`grid grid-cols-1 ${items.length === 2 ? 'sm:grid-cols-2' : items.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-5' : ''} gap-6 w-full h-full`}>
            {items.map((item, index) => {
                const Icon = item.icon || defaultIcons[item.label] || Eye;

                return (
                    <Card
                        key={index}
                        className={`
                            relative overflow-hidden border-slate-200 transition-all duration-300 group cursor-pointer rounded-2xl
                            ${items.length === 1
                                ? 'border-2 border-slate-900 bg-slate-900 hover:border-emerald-500/50 w-full h-full'
                                : items.length === 2
                                    ? `border-2 ${index === 0 ? 'border-slate-900 bg-slate-900 hover:border-emerald-500/50' : 'bg-white hover:border-arcipta-orange hover:shadow-lg hover:shadow-orange-500/10'}`
                                    : index === 0
                                        ? 'lg:col-span-2 border-2 border-slate-900 bg-slate-900 hover:border-emerald-500/50'
                                        : 'lg:col-span-1 bg-white hover:border-arcipta-orange hover:shadow-lg hover:shadow-orange-500/10'}
                        `}
                    >
                        <div className={`absolute top-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${index === 0 ? 'bg-emerald-400' : 'bg-arcipta-orange'}`} />

                        <CardContent className={`px-8 py-6 ${items.length === 1 ? 'h-full flex flex-col justify-center' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${index === 0 ? 'text-slate-400' : 'text-slate-400'}`}>
                                    {item.label}
                                </span>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${index === 0 ? 'bg-white text-slate-900 shadow-white/10' : 'bg-arcipta-orange text-white shadow-orange-500/30'}`}>
                                    <Icon size={24} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className={`text-4xl lg:text-5xl font-black leading-none ${index === 0 ? 'text-white' : 'text-slate-900'}`}>
                                    {item.value}
                                </div>

                                <div className={`flex items-center gap-2 text-xs font-bold ${index === 0 ? 'text-emerald-400' : 'text-emerald-500'}`}>
                                    <TrendingUp className="h-4 w-4" />
                                    <span>+12.5% vs last period</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
