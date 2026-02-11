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
    useSidebar,
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
    const { state, setOpen } = useSidebar()
    
    const isAnyChildActive = item.items?.some((subItem) =>
        subItem.url !== "#" && (
            pathname === subItem.url || (subItem.url !== "/" && pathname.startsWith(subItem.url + "/"))
        )
    )

    const handleTriggerClick = (e: React.MouseEvent) => {
        if (state === "collapsed") {
            e.preventDefault()
            setOpen(true)
        }
    }

    return (
        <Collapsible
            className="group/collapsible"
            defaultOpen={isAnyChildActive}
        >
            <CollapsibleTrigger asChild onClick={handleTriggerClick}>
                <SidebarMenuButton isActive={isAnyChildActive} tooltip={item.title}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
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