"use client"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import logo from "@/public/images/logo_arcipta.png"

export function SidebarLogo() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                    <a href="#">
                        <div className="flex bg-transparent aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                            <img src={logo.src} alt="Logo" width={24} height={24} />
                        </div>
                        <div className="flex flex-col gap-0.5 leading-none">
                            <span className="font-semibold">ARCIPTA</span>
                            <span className="text-xs">Since 2025</span>
                        </div>
                    </a>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
