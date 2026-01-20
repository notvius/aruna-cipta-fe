"use client"

import { usePathname } from "next/navigation"
import { mainMenuItems, cmsMenuItems } from "@/constants/sidebar-items"

export default function Heading() {
    const pathname = usePathname()

    const getActiveTitle = () => {
        const allItems = [
            ...mainMenuItems,
            ...cmsMenuItems,
            ...mainMenuItems.flatMap(item => item.items || []),
        ]

        if (pathname === "/") return "Overview"

        // Try exact match first
        const exactMatch = allItems.find(item => item.url !== "#" && item.url === pathname)
        if (exactMatch) return exactMatch.title

        // Try parent match for sub-paths (e.g., /article/create)
        const parentMatch = allItems.find(item =>
            item.url !== "#" && item.url !== "/" && pathname.startsWith(item.url + "/")
        )

        if (parentMatch) {
            // Check for common sub-paths
            if (pathname.endsWith("/create")) return `Create ${parentMatch.title}`
            if (pathname.includes("/edit/")) return `Edit ${parentMatch.title}`
            return parentMatch.title
        }

        return "Overview"
    }

    return (
        <h1 className="text-sm font-semibold">
            {getActiveTitle()}
        </h1>
    )
}