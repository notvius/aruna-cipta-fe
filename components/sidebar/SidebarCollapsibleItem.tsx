import { usePathname } from "next/navigation"
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
    const pathname = usePathname()
    const isAnyChildActive = item.items?.some((subItem) =>
        subItem.url !== "#" && (
            pathname === subItem.url || (subItem.url !== "/" && pathname.startsWith(subItem.url + "/"))
        )
    )

    return (
        <Collapsible
            className="group/collapsible"
            defaultOpen={isAnyChildActive}
        >
            <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isAnyChildActive}>
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-500 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                        const isSubActive = pathname === subItem.url
                        return (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                    <a href={subItem.url}>
                                        <span>{subItem.title}</span>
                                    </a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        )
                    })}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    )
}
