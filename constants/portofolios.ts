import { type Service } from "./services";

export interface Portofolio {
    id: number;
    thumbnail: string;
    title: string;
    slug: string; 
    client_name: string;
    year: string;
    category: Service['id'][];
    problem: string;
    solution: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}