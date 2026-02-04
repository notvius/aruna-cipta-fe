import { type PortofolioContent } from "@/constants/portofolios_contents";
export { type PortofolioContent } from "@/constants/portofolios_contents";

export const portofoliosContentsData: PortofolioContent[] = [
    {
        id: 1,
        portofolio_id: 1,
        context: "The retail market is shifting rapidly to digital platforms.",
        challenge: "Integrating legacy inventory systems with modern web architecture.",
        approach: "Using a microservices architecture to ensure scalability and ease of maintenance.",
        image_process: [
            "/images/portofolio-contents/ai.jpg",
            "/images/portofolio-contents/trump.jpg"
        ],
        impact: "30% increase in online sales during the first quarter after launch.",
    },
    {
        id: 2,
        portofolio_id: 2,
        context: "Premium real estate requires premium digital presence.",
        challenge: "Ensuring the high-resolution assets do not compromise page load speeds.",
        approach: "Implementing dynamic asset loading and Next.js Image optimization.",
        image_process: [
            "/images/portofolio-contents/ai.jpg",
            "/images/portofolio-contents/trump.jpg"
        ],
        impact: "Average user time-on-page increased by 45%.",
    },
    {
        id: 3,
        portofolio_id: 3,
        context: "Sustainability in logistics is becoming a priority.",
        challenge: "Real-time data synchronization with limited connectivity in rural areas.",
        approach: "MQTT protocol for efficient data transmission and offline-first capabilities.",
        image_process: [
            "/images/portofolio-contents/ai.jpg",
            "/images/portofolio-contents/trump.jpg"
        ],
        impact: "Reduced operational costs by 15% through optimized battery usage.",
    },
];