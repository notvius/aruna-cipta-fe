export interface Testimonial {
    id: string;
    clientName: string;
    clientTitle: string;
    content: string;
    status: "Published" | "Unpublished";
    createdAt: string;
    updatedAt: string;
}