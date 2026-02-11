export interface Permission {
    id: number;
    module: string;
    action: string;
    uuid?: string;
    name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    uuid: string | null; 
    username: string;
    is_active: 0 | 1;
    is_superadmin: 0 | 1; 
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    permissions?: Permission[];
}