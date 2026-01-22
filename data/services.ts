import type { Service } from "@/constants/services";
import { Phone } from "lucide-react";
export type { Service } from "@/constants/services";

export const servicesData: Service[] = [
    {
        id: "SERV001",
        title: "Mobile Development",
        content: "Mobile development is the process of creating software applications for mobile devices, such as smartphones and tablets. Mobile development typically involves using programming languages and frameworks to create applications that can run on mobile devices.",
        icon: "Phone",
        featured_image: "/images/services/ai.jpg",
        status: "Published",
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-02T10:00:00Z",
    },
    {
        id: "SERV002",
        title: "Web Development",
        content: "Web development is the process of creating software applications for the web. Web development typically involves using programming languages and frameworks to create applications that can run on web browsers.",
        icon: "Phone",
        featured_image: "/images/services/trump.jpg",
        status: "Published",
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-02T10:00:00Z",
    },
    {
        id: "SERV003",
        title: "UI/UX Design",
        content: "UI/UX design is the process of creating user interfaces and user experiences for software applications. UI/UX design typically involves using design tools and frameworks to create interfaces that are easy to use and visually appealing.",
        icon: "Phone",
        featured_image: "/images/services/evcars.jpg",
        status: "Published",
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-02T10:00:00Z",
    },
    {
        id: "SERV004",
        title: "Digital Marketing",
        content: "Digital marketing is the process of promoting products and services using digital channels, such as social media, email marketing, and search engine optimization. Digital marketing typically involves using marketing tools and frameworks to create campaigns that are easy to use and visually appealing.",
        icon: "Phone",
        featured_image: "/images/services/pizza.jpg",
        status: "Published",
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-02T10:00:00Z",
    },

];