"use client"

import { usePathname } from "next/navigation"
import { mainMenuItems, cmsMenuItems } from "@/constants/sidebar-items"

export default function Heading() {
    const pathname = usePathname()

    const getActiveTitle = () => {
        const allItems = [
            ...mainMenuItems,
            ...cmsMenuItems,
            ...(mainMenuItems.flatMap(item => item.items || [])),
            ...(cmsMenuItems.flatMap(item => item.items || [])),
        ]

        if (pathname === "/") return "Overview"

        const matches = allItems.filter(item => 
            item.url !== "#" && 
            item.url !== "/" && 
            (pathname === item.url || pathname.startsWith(item.url + "/"))
        )

        if (matches.length > 0) {
            const bestMatch = matches.sort((a, b) => b.url.length - a.url.length)[0]
            
            if (pathname.endsWith("/create")) return `Create ${bestMatch.title}`
            if (pathname.includes("/edit/")) return `Edit ${bestMatch.title}`
            
            return bestMatch.title
        }

        return "Overview" 
    }

    return (
        <h1 className="text-sm font-semibold">
            {getActiveTitle()}
        </h1>
    )
}