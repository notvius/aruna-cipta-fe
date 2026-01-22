export interface Gallery {
    id: string;
    file_path: string;
    caption: string;
    alt_text: string;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}



