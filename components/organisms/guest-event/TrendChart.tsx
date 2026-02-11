"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TrendData } from "@/constants/guest_events";
import { Calendar } from "lucide-react";

interface Props {
    title: string;
    data: TrendData[];
    dataKeys: string[];
}

export function TrendChart({ title, data, dataKeys }: Props) {
    const dateRange = "Engagement data from the last 7 days";

    return (
        <Card className="group border-none shadow-sm bg-orange-50/40 rounded-3xl overflow-hidden font-satoshi transition-all duration-500 cursor-default hover:bg-orange-50 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)]">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between px-8 pt-8 pb-0 gap-4">
                <div className="space-y-1.5">
                    <CardTitle className="text-xs font-bold font-orbitron text-slate-900 uppercase tracking-tight">
                        {title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-orange-600/70">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{dateRange}</span>
                    </div>
                </div>

                <div className="flex items-center gap-5 bg-white/50 px-4 py-2 rounded-xl border border-white/50 group-hover:bg-white transition-colors duration-500">
                    {dataKeys.map((key, i) => (
                        <div key={key} className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-orange-500' : 'bg-blue-300'}`} />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{key}</span>
                        </div>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-0">
                <div className="h-[450px] w-full mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 35 }}
                            barGap={6}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="#fed7aa"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#c2410c', fontSize: 11, fontWeight: 700 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#c2410c', fontSize: 11, fontWeight: 700 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.4)', radius: 12 }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white border border-orange-100 shadow-2xl rounded-2xl p-4 outline-none min-w-[150px]">
                                                <p className="text-[10px] font-bold text-orange-400 uppercase mb-3 tracking-widest">
                                                    {payload[0].payload.name}
                                                </p>
                                                <div className="space-y-3">
                                                    {payload.map((entry: any, index: number) => (
                                                        <div key={index} className="flex items-center justify-between gap-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                                <span className="text-[11px] text-slate-500 font-bold uppercase">{entry.name}</span>
                                                            </div>
                                                            <span className="text-[12px] font-black text-slate-900 font-orbitron">{entry.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey={dataKeys[0]}
                                fill="#3b82f6"
                                radius={[6, 6, 0, 0]}
                                barSize={35}
                            />
                            <Bar
                                dataKey={dataKeys[1]}
                                fill="#f97316"
                                radius={[6, 6, 0, 0]}
                                barSize={35}
                            />
                            <Bar
                                dataKey={dataKeys[2]}
                                fill="#93c5fd"
                                radius={[6, 6, 0, 0]}
                                barSize={35}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}