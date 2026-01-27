import {
    LayoutDashboard,
    User,
    Users,
    ChartNoAxesColumnDecreasing,
    BookImage,
    Newspaper,
    BriefcaseBusiness,
    Star,
    TableOfContents,
    Handshake,
    Plus
} from "lucide-react"
import { title } from "process"

export const mainMenuItems = [
    {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "#",
        icon: User,
        items: [
            {
                title: "User Management",
                url: "/user",
                icon: User,
            },
            {
                title: "Activity Log",
                url: "/user/activity-log",
                icon: User,
            }
        ]
    },
    {
        title: "Guest Tracking",
        url: "#",
        icon: Users,
        items: [
            {
                title: "Article Analytics",
                url: "/guest-event/article",
                icon: ChartNoAxesColumnDecreasing,
            },
            {
                title: "Growth Pass Analytics",
                url: "/guest-event/growth-pass",
                icon: ChartNoAxesColumnDecreasing,
            },
            {
                title: "Service Analytics",
                url: "/guest-event/service",
                icon: ChartNoAxesColumnDecreasing,
            },
            {
                title: "WhatsApp Analytics",
                url: "/guest-event/whatsapp",
                icon: ChartNoAxesColumnDecreasing,
            },
        ]
    },
]

export const cmsMenuItems = [
    {
        title: "Article",
        url: "#",
        icon: Newspaper,
        items: [
            {
                title: "Artikel Items",
                url: "/article",
                icon: Plus,
            },
            {
                title: "Article Category",
                url: "/article/category",
                icon: TableOfContents,
            },
        ]
    },
    {
        title: "FAQ",
        url: "/faq",
        icon: TableOfContents,
    },
    {
        title: "Gallery",
        url: "/gallery",
        icon: BookImage,
    },
    {
        title: "Portofolio",
        url: "/portofolio",
        icon: BriefcaseBusiness,
    },
    {
        title: "Services",
        url: "/service",
        icon: Handshake,
    },
    {
        title: "Testimonial",
        url: "/testimonial",
        icon: Star,
    },
]
