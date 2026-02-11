"use client";

import * as React from "react";
import Cookies from "js-cookie";
import AnalyticsOverviewHeader, { type AnalyticModel } from "@/components/organisms/dashboard/AnalyticsOverviewHeader";
import { AnalyticsSection } from "@/components/dashboard/AnalyticSection";
import { type GuestEvent } from "@/constants/guest_events";
import { models } from "@/constants/item-header-items";

export default function OverviewPage() {
    const [headerData, setHeaderData] = React.useState<AnalyticModel[]>(models);
    const [articlesData, setArticlesData] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const mapDots = [
        {
            start: { lat: -6.1751, lng: 106.8650, label: "Jakarta" },
            end: { lat: -8.4095, lng: 115.1889, label: "Bali" },
        },
        {
            start: { lat: -7.2575, lng: 112.7521, label: "Surabaya" },
            end: { lat: 0.4717, lng: 101.4478, label: "Pekanbaru" },
        },
        {
            start: { lat: 3.5952, lng: 98.6722, label: "Medan" },
            end: { lat: -0.9481, lng: 100.3773, label: "Padang" },
        },
        {
            start: { lat: -5.1477, lng: 119.4327, label: "Makassar" },
            end: { lat: -3.3186, lng: 114.5944, label: "Banjarmasin" },
        },
    ];

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guest-event`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            const actualData = Array.isArray(data) ? data : data.data || [];

            const waCount = actualData.filter((e: GuestEvent) =>
                e.event_type?.toLowerCase() === 'whatsapp' || e.event_subtype?.toLowerCase() === 'whatsapp'
            ).length;

            const gpCount = actualData.filter((e: GuestEvent) =>
                e.event_subtype?.toLowerCase().includes('growth-pass')
            ).length;

            const serviceCount = actualData.filter((e: GuestEvent) =>
                e.event_subtype?.toLowerCase().includes('service')
            ).length;

            const articleEvents = actualData.filter((e: GuestEvent) =>
                e.event_subtype === 'article'
            );
            const articleCount = articleEvents.length;

            const newHeaderData = models.map(model => {
                let val = 0;
                if (model.name === "WhatsApp Analytic") val = waCount;
                if (model.name === "Growth Pass Analytic") val = gpCount;
                if (model.name === "Service Analytic") val = serviceCount;
                if (model.name === "Article Analytic") val = articleCount;
                return { ...model, summary: val.toLocaleString() };
            });

            setHeaderData(newHeaderData);

            const pageViews: Record<string, number> = {};
            articleEvents.forEach((e: GuestEvent) => {
                const url = e.page_url;
                pageViews[url] = (pageViews[url] || 0) + 1;
            });

            const sortedArticles = Object.entries(pageViews)
                .map(([url, views]) => ({
                    article: url.split('/').pop()?.replace(/-/g, ' ') || 'Unknown Article',
                    views
                }))
                .sort((a, b) => b.views - a.views)
                .slice(0, 5);

            setArticlesData(sortedArticles);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    return (
        <div className="flex flex-col gap-8 p-8 font-satoshi animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AnalyticsOverviewHeader data={headerData} />

            <div className="rounded-[32px] overflow-hidden border border-slate-200 bg-white shadow-sm">
                <AnalyticsSection articlesData={articlesData} mapDots={mapDots} />
            </div>
        </div>
    );
}