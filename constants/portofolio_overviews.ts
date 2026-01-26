import { type Portofolio } from "./portofolios";

export interface PortofolioOverview {
    id: number;
    portofolio_id: Portofolio['id'];
    problem: string;
    solution: string;
    role: string;
}