"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface SubItem {
    title: string
    url: string
    icon?: LucideIcon
}

interface SidebarItemProps {
    item: {
        title: string
        url: string
        icon: LucideIcon
        items?: SubItem[]
    }
}

export function SidebarCollapsibleItem({ item }: SidebarItemProps) {
    return (
        <Collapsible
            className="group/collapsible"
        >
            <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-500 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                </a>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    )
}
