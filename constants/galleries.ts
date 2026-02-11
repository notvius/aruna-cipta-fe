export interface Gallery {
    id: number;
    uuid: string;
    file_path: string;
    caption: string;
    alt_text: string;
    is_published: boolean;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}