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
    Handshake
} from "lucide-react"

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
    },
    {
        title: "Guest Tracking",
        url: "#",
        icon: Users,
        items: [
            {
                title: "WhatsApp Analytics",
                url: "#",
                icon: ChartNoAxesColumnDecreasing,
            },
            {
                title: "Article Analytics",
                url: "#",
                icon: ChartNoAxesColumnDecreasing,
            },
            {
                title: "Growth Pass Analytics",
                url: "#",
                icon: ChartNoAxesColumnDecreasing,
            },
            {
                title: "Service Analytics",
                url: "#",
                icon: ChartNoAxesColumnDecreasing,
            },
        ]
    },
]

export const cmsMenuItems = [
    {
        title: "Article",
        url: "/article",
        icon: Newspaper,
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
        title: "Portfolio",
        url: "/portfolio",
        icon: BriefcaseBusiness,
    },
    {
        title: "Services",
        url: "/service",
        icon: Handshake,
    },
    {
        title: "Testimonial",
        url: "/testmonial",
        icon: Star,
    },
]
