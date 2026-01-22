export interface Gallery {
    id: string;
    file_path: string;
    caption: string;
    alt_text: string;
    is_published: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}



