"use client"

import { type LucideIcon } from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarCollapsibleItem } from "@/components/sidebar/sidebar-collapsible-item"

interface MenuItem {
    title: string
    url: string
    icon: LucideIcon
    items?: {
        title: string
        url: string
        icon?: LucideIcon
    }[]
}

interface SidebarMenuListProps {
    title: string
    items: MenuItem[]
    className?: string
}

export function SidebarMenuList({ title, items, className }: SidebarMenuListProps) {
    return (
        <SidebarGroup className={className}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.items ? (
                                <SidebarCollapsibleItem item={item as any} />
                            ) : (
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
