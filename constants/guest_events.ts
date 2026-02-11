export interface GuestEvent {
    id: number | string;
    uuid?: string;
    event_type: string;
    event_subtype: string;
    page_url: string;
    ip_address: string;
    user_agent: string;
    created_at: string | Date;
    updated_at: string | Date;
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