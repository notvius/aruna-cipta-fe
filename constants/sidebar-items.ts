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
        url: "/admin/overview",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "#",
        icon: User,
        items: [
            {
                title: "User Management",
                url: "/admin/user",
                icon: User,
                module: "users"
            },
            {
                title: "Activity Log",
                url: "/admin/user/activity-log",
                icon: User,
                module: "activity-logs"
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
                url: "/admin/guest-event/article",
                icon: ChartNoAxesColumnDecreasing,
                module: "guest-events"
            },
            {
                title: "Growth Pass Analytics",
                url: "/admin/guest-event/growth-pass",
                icon: ChartNoAxesColumnDecreasing,
                module: "guest-events"
            },
            {
                title: "Service Analytics",
                url: "/admin/guest-event/service",
                icon: ChartNoAxesColumnDecreasing,
                module: "guest-events"
            },
            {
                title: "WhatsApp Analytics",
                url: "/admin/guest-event/whatsapp",
                icon: ChartNoAxesColumnDecreasing,
                module: "guest-events"
            },
        ]
    },
]

export const cmsMenuItems = [
    {
        title: "Article",
        url: "/admin/article",
        icon: Newspaper,
        module: "articles"
    },
    {
        title: "FAQ",
        url: "/admin/faq",
        icon: TableOfContents,
        module: "faqs"
    },
    {
        title: "Gallery",
        url: "/admin/gallery",
        icon: BookImage,
        module: "galleries"
    },
    {
        title: "Portfolio",
        url: "/admin/portfolio",
        icon: BriefcaseBusiness,
        module: "portfolios"
    },
    {
        title: "Services",
        url: "/admin/service",
        icon: Handshake,
        module: "services"
    },
    {
        title: "Testimonial",
        url: "/admin/testimonial",
        icon: Star,
        module: "testimonials"
    },
]