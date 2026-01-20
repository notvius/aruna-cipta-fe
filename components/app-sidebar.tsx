"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { SidebarLogo } from "@/components/sidebar/SidebarLogo"
import { SidebarMenuList } from "@/components/sidebar/SidebarMenuList"
import { SidebarUser } from "@/components/sidebar/SidebarUser"
import { mainMenuItems, cmsMenuItems } from "@/constants/sidebar-items"

// Mock user data - in a real app this would likely come from auth props or context
const data = {
    user: {
        name: "Username",
        email: "user@example.com",
        avatar: "https://github.com/shadcn.png",
    },
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarLogo />
            </SidebarHeader>
            <SidebarContent className="gap-0">
                <SidebarMenuList
                    title="MAIN MENU"
                    items={mainMenuItems}
                    className="pb-0"
                />
                <SidebarMenuList
                    title="CMS MENU"
                    items={cmsMenuItems}
                    className="pt-0"
                />
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
