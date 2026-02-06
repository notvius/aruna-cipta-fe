export interface GuestEvent {
    id: number;
    event_type: string;
    event_subtype: string;
    page_url: string;
    ip_address: string;
    user_agent: string;
    created_at: Date;
}

export interface AnalyticsSummaryItem {
    label: string;
    value: string | number;
    trend: string;
    iconType: "eye" | "play" | "check" | "chart" | "wa" | "growth" | "service" | "mouse";
}

export interface TrendData {
    name: string;
    [key: string]: string | number;
}