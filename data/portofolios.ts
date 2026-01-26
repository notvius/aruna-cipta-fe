import {type Portofolio} from "../constants/portofolios";
export {type Portofolio} from "../constants/portofolios";

export const portofoliosData: Portofolio[] = [
    {
        id: 1,
        thumbnail: "/images/portofolios/ai.jpg",
        title: "AI Project",
        client_name: "Richard",
        year: "2024",
        category: [1],
        created_at: new Date("2024-01-01T10:00:00Z"),
        updated_at: new Date("2024-01-02T10:00:00Z"),
    },
    {
        id: 2,
        thumbnail: "/images/portofolios/trump.jpg",
        title: "Trump Project",
        client_name: "Donald Trump",
        year: "2024",
        category: [2],
        created_at: new Date("2024-01-05T10:00:00Z"),
        updated_at: new Date("2024-01-05T10:00:00Z"),
    },
    {
        id: 3,
        thumbnail: "/images/portofolios/evcars.jpg",
        title: "Big Project",
        client_name: "Samuel",
        year: "2024",
        category: [3],
        created_at: new Date("2024-01-10T10:00:00Z"),
        updated_at: new Date("2024-01-12T10:00:00Z"),
    },
];