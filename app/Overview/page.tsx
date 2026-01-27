"use client";

import AnalyticsOverviewHeader from "@/components/organisms/dashboard/AnalyticsOverviewHeader";
import { AnalyticsSection } from "@/components/dashboard/AnalyticSection";

const articlesData = [
    { article: "How to use AI", views: 1250 },
    { article: "The Future of Web", views: 980 },
    { article: "Top 10 Shadcn UI", views: 850 },
    { article: "React Server Components", views: 720 },
    { article: "Next.js 15 Guide", views: 650 },
];

const mapDots = [
    {
        start: { lat: -6.1751, lng: 106.8650 }, // Jakarta
        end: { lat: -8.4095, lng: 115.1889 }, // Bali
    },
    {
        start: { lat: -7.2575, lng: 112.7521 }, // Surabaya
        end: { lat: -8.4095, lng: 115.1889 }, // Bali
    },
    {
        start: { lat: 3.5952, lng: 98.6722 }, // Medan
        end: { lat: -6.1751, lng: 106.8650 }, // Jakarta
    },
    {
        start: { lat: -5.1477, lng: 119.4327 }, // Makassar
        end: { lat: -6.1751, lng: 106.8650 }, // Jakarta
    },
    {
        start: { lat: -1.2379, lng: 116.8529 }, // Balikpapan
        end: { lat: -6.1751, lng: 106.8650 }, // Jakarta
    },
    {
        start: { lat: -2.5489, lng: 140.7181 }, // Jayapura
        end: { lat: -5.1477, lng: 119.4327 }, // Makassar
    }
];

export default function OverviewPage() {
    return (
        <div className="flex flex-col gap-6">
            <AnalyticsOverviewHeader />
            <AnalyticsSection articlesData={articlesData} mapDots={mapDots} />
        </div>
    );
}