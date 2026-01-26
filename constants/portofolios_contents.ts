import { type Portofolio } from "./portofolios";

export interface PortofolioContent {
    id: number;
    portofolio_id: Portofolio['id'];
    context: string;
    challenge: string;
    approach: string;
    image_process: string[];
    impact: string;
}