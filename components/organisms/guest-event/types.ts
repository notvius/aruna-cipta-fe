import { LucideIcon } from "lucide-react";

export interface SummaryItem {
    label: string;
    value: string | number;
    icon?: LucideIcon;
}

export interface TrendData {
    name: string;
    [key: string]: string | number;
}

export interface GuestEvent {
    id: number;
    time: string;
    event_type: string;
    target: string;
    page_url: string;
}

export interface DashboardHeader {
    title: string;
    description: string;
}

export interface DashboardFilter {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}
