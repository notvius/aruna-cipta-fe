"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
    views: {
        label: "Views",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

export interface ArticleData {
    article: string;
    views: number;
}

interface TopArticlesChartProps {
    data: ArticleData[];
}

export function TopArticlesChart({ data }: TopArticlesChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 5 Articles</CardTitle>
                <CardDescription>Most viewed articles this month</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="article"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={100}
                            tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
                        />
                        <XAxis dataKey="views" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="views" fill="var(--color-views)" radius={5}>
                            <LabelList
                                dataKey="views"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing top articles based on total views
                </div>
            </CardFooter>
        </Card>
    )
}
