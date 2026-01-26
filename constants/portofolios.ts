import { type Service } from "./services";

export interface Portofolio {
    id: number;
    thumbnail: string;
    title: string;
    client_name: string;
    year: string;
    category: Service['id'][];
    created_at: Date;
    updated_at: Date;
}