import { usePathname } from "next/navigation"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarCollapsibleItem } from "@/components/sidebar/SidebarCollapsibleItem"
import { LucideIcon } from "lucide-react"

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
    const pathname = usePathname()

    return (
        <SidebarGroup className={className}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = item.url !== "#" && (
                            pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url + "/"))
                        )
                        return (
                            <SidebarMenuItem key={item.title}>
                                {item.items ? (
                                    <SidebarCollapsibleItem item={item as any} />
                                ) : (
                                    <SidebarMenuButton asChild isActive={isActive}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
