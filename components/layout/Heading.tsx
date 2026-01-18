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
            ...cmsMenuItems.flatMap(item => item || [])
        ]

        if (pathname === "/") return "Overview"

        const activeItem = allItems.find(item =>
            item.url !== "#" && item.url === pathname
        )

        return activeItem ? activeItem.title : "Overview"
    }

    return (
        <h1 className="text-sm font-semibold">
            {getActiveTitle()}
        </h1>
    )
}