import { type User } from "./users";

export interface ActivityLog {
    id: number;
    user_id: User['id'];
    action: string;
    target_type: string;
    target_id: number;
    ip_address: string;
    user_agent: string;
    created_at: Date;
}



