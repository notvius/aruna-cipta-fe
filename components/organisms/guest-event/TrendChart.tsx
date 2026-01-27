"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { TrendData } from "./types";

interface TrendChartProps {
    title: string;
    description?: string;
    data: TrendData[];
    config: ChartConfig;
    dataKeys: string[];
}

export function TrendChart({ title, description, data, config, dataKeys }: TrendChartProps) {
    return (
        <Card className="w-full h-full relative overflow-hidden group transition-all duration-300 hover:border-arcipta-orange/50">
            {/* Hover Animated Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-arcipta-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <ChartContainer config={config} className="h-[300px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        {dataKeys.map((key) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={`var(--color-${key})`}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
