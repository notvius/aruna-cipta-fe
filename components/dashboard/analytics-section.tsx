"use client";

import { TopArticlesChart, type ArticleData } from "@/components/charts/top-articles-chart";
import IndonesiaMap from "@/components/ui/world-map";

interface AnalyticsSectionProps {
    articlesData: ArticleData[];
    mapDots: Array<{
        start: { lat: number; lng: number; label?: string };
        end: { lat: number; lng: number; label?: string };
    }>;
}

export function AnalyticsSection({ articlesData, mapDots }: AnalyticsSectionProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6 pb-4">
                    <h3 className="font-semibold leading-none tracking-tight">Active Usage Map</h3>
                    <p className="text-sm text-muted-foreground">User distribution across Indonesia</p>
                </div>
                <div className="p-0 overflow-hidden rounded-b-xl">
                    <IndonesiaMap dots={mapDots} lineColor="#0ea5e9" />
                </div>
            </div>

            <TopArticlesChart data={articlesData} />
        </div>
    );
}
