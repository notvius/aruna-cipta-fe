export interface GuestEvent {
    id: number;
    event_type: string;
    event_subtype: string;
    page_url: string;
    ip_address: string;
    user_agent: string;
    created_at: Date;
}



