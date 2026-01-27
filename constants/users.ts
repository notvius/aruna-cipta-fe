export interface User {
    id: number;
    username: string;
    password_hash: string;
    is_active: boolean;
    is_superadmin: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}