"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { ChevronsUpDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function SidebarUser() {
    const { isMobile } = useSidebar()
    const router = useRouter()
    const [username, setUsername] = React.useState<string>("User")
    const [role, setRole] = React.useState<string>("Admin")

    React.useEffect(() => {
        const token = Cookies.get("token")
        let loginUsername = Cookies.get("username")

        if (!loginUsername && token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                loginUsername = payload.username
            } catch (e) {}
        }

        if (loginUsername) setUsername(loginUsername)

        const fetchProfile = async () => {
            if (!loginUsername || !token) return;
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
                const res = await fetch(`${baseUrl}/user`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const result = await res.json();
                    const users = Array.isArray(result) ? result : (result.data || []);
                    const me = users.find((u: any) => u.username === loginUsername);
                    
                    if (me) {
                        setUsername(me.username);
                        const isSuper = Number(me.is_superadmin) === 1;
                        setRole(isSuper ? "Superadmin" : "Admin");
                    }
                }
            } catch (error) {}
        }

        fetchProfile();
    }, [])

    const handleLogout = () => {
        Cookies.remove("token")
        Cookies.remove("username")
        router.push("/login")
    }

    const initial = username.charAt(0).toUpperCase()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-0"
                        >
                            <Avatar className="h-8 w-8 rounded-full border border-slate-200">
                                <AvatarFallback className="rounded-full font-bold bg-arcipta-blue-primary/10 text-arcipta-blue-primary font-orbitron text-xs">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight ml-1 gap-1.5">
                                <span className="truncate font-bold text-slate-900 group-data-[collapsible=icon]:hidden">{username}</span>
                                <span className="truncate text-[10px] font-bold text-slate-400 uppercase tracking-widest group-data-[collapsible=icon]:hidden">{role}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 text-slate-400 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 rounded-2xl shadow-2xl border-slate-100 p-1.5 font-jakarta bg-white"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                                <Avatar className="h-9 w-9 rounded-full border border-slate-100">
                                    <AvatarFallback className="rounded-full font-bold bg-arcipta-blue-primary/10 text-arcipta-blue-primary font-orbitron text-xs">
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold text-slate-900">{username}</span>
                                    <span className="truncate text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem onClick={handleLogout} className="rounded-lg py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}