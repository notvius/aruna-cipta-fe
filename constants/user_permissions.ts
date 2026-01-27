import { User } from "./users";
import { Permission } from "./permissions";

export interface UserPermission {
    id: number;
    user_id: User['id'];
    permission_id: Permission['id'];
    is_allowed: boolean;
    created_at: Date;
    updated_at: Date;
}