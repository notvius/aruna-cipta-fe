import AnalyticsOverviewHeader from "@/components/organisms/dashboard/AnalyticsOverviewHeader";
import { AnalyticsSection } from "@/components/dashboard/AnalyticSection";
import { articlePerformanceData } from "@/data/guest_event_analytics";

export default function OverviewPage() {
    const articlesData = articlePerformanceData.slice(0, 5).map(article => ({
        article: article.title,
        views: article.views
    }));

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

    return (
        <div className="flex flex-col gap-6">
            <AnalyticsOverviewHeader />
            <AnalyticsSection articlesData={articlesData} mapDots={mapDots} />
        </div>
    );
}