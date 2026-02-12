export interface Portfolio {
    id: number;
    uuid: string;
    thumbnail: string;
    thumbnail_url: string;
    image_url?: string;
    title: string;
    slug: string; 
    client_name: string;
    year: string;
    service_id: number;
    service?: {
        id: number;
        title: string;
    };
    problem: string;
    solution: string;
    role: string;
    created_at: string;
    updated_at: string;
    content?: PortfolioContent;
}

export interface PortfolioContent {
    id: number;
    portfolio_id: number;
    context: string;
    challenge: string;
    approach: string;
    image_process: string[];
    image_urls: string[];
    thumbnail_urls?: string[];
    impact: string;
}