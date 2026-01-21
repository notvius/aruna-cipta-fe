export interface Gallery {
    id: string;
    file_path: string;
    caption: string;
    alt_text: string;
    status: "Published" | "Unpublished";
    createdAt: string;
    updatedAt: string;
}



