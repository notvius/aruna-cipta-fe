import { type User } from "./users";

export interface ActivityLog {
    id: number;
    user_id: number;
    user?: User;
    action: string;
    target_type: string;
    target_id: number;
    target_uuid: string | null;
    ip_address: string;
    user_agent: string;
    created_at: string;
    updated_at: string;
}



