"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
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
    module?: string 
    items?: {
        title: string
        url: string
        module?: string
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
    const [userPerms, setUserPerms] = React.useState<string[]>([])
    const [isSuper, setIsSuper] = React.useState<boolean>(false)
    const [isLoaded, setIsLoaded] = React.useState(false)

    React.useEffect(() => {
        const token = Cookies.get("token")
        const loginUsername = Cookies.get("username")
        
        if (!token || !loginUsername) {
            setIsLoaded(true)
            return
        }

        const fetchUserAccess = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
                const res = await fetch(`${baseUrl}/user`, {
                    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
                });

                if (res.ok) {
                    const result = await res.json();
                    const users = Array.isArray(result) ? result : (result.data || []);
                    const me = users.find((u: any) => u.username === loginUsername);
                    
                    if (me) {
                        setIsSuper(Number(me.is_superadmin) === 1);
                        setUserPerms(Array.isArray(me.permissions) ? me.permissions : []);
                    }
                }
            } catch (e) {
            } finally {
                setIsLoaded(true)
            }
        }
        fetchUserAccess()
    }, [])

    const filteredItems = React.useMemo(() => {
        if (!isLoaded || isSuper) return items;

        return items.filter(item => {
            if (!item.module && !item.items) return true;

            if (item.items) {
                const filteredSubItems = item.items.filter(sub => 
                    !sub.module || userPerms.some(p => p.startsWith(`${sub.module}.`))
                );
                return filteredSubItems.length > 0;
            }
            
            return item.module && userPerms.some(p => p.startsWith(`${item.module}.`));
        });
    }, [items, userPerms, isSuper, isLoaded]);

    if (isLoaded && filteredItems.length === 0) return null;

    return (
        <SidebarGroup className={className}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {filteredItems.map((item) => {
                        const isActive = item.url !== "#" && (
                            pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url + "/"))
                        )

                        const finalSubItems = item.items ? (
                            isSuper ? item.items : item.items.filter(sub => !sub.module || userPerms.some(p => p.startsWith(`${sub.module}.`)))
                        ) : undefined;

                        return (
                            <SidebarMenuItem key={item.title}>
                                {item.items ? (
                                    <SidebarCollapsibleItem item={{ ...item, items: finalSubItems } as any} />
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