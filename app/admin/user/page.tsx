"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/user/UserColumns";
import { type User, type Permission } from "@/constants/users";
import { ViewUserModal } from "@/components/organisms/user/ViewUserModal";
import { UserFormModal } from "@/components/organisms/user/UserFormModal";
import { UserFilter } from "@/components/organisms/user/UserFilter";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function UserPage() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [permissions, setPermissions] = React.useState<Permission[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [viewItem, setViewItem] = React.useState<User | null>(null);
    const [editItem, setEditItem] = React.useState<User | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<User[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [roleFilter, setRoleFilter] = React.useState("all");
    const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

    const refreshData = React.useCallback(async () => {
        const token = Cookies.get("token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        setIsLoading(true);
        try {
            const [uRes, pRes] = await Promise.all([
                fetch(`${baseUrl}/user`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${baseUrl}/permission`, { headers: { "Authorization": `Bearer ${token}` } })
            ]);
            const uData = await uRes.json();
            const pData = await pRes.json();
            const rawUsers = Array.isArray(uData) ? uData : (uData.data || []);
            setUsers(rawUsers.map((u: any) => ({ ...u, is_active: u.is_active ? 1 : 0 } as User)));
            setPermissions(Array.isArray(pData) ? pData : (pData.data || []));
        } catch (err) {
            triggerError("Failed to fetch user data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => { refreshData(); }, [refreshData]);

    const triggerSuccess = (msg: string, skipRefresh = false) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 3000);
        if (!skipRefresh) refreshData();
    };

    const triggerError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    const filteredData = React.useMemo(() => {
        return users.filter((u) => {
            const matchesSearch = u.username.toLowerCase().includes(globalFilter.toLowerCase());
            const matchesRole = roleFilter === "all" || (roleFilter === "superadmin" ? u.is_superadmin === 1 : u.is_superadmin === 0);
            const itemDate = new Date(u.created_at).setHours(0, 0, 0, 0);
            const start = dateRange.start ? new Date(dateRange.start).setHours(0, 0, 0, 0) : null;
            const end = dateRange.end ? new Date(dateRange.end).setHours(23, 59, 59, 999) : null;
            return matchesSearch && matchesRole && (!start || itemDate >= start) && (!end || itemDate <= end);
        });
    }, [users, globalFilter, roleFilter, dateRange]);

    const handleUpdateStatus = async (user: User, nextActiveState: number) => {
        const previousUsers = [...users];
        const nextActiveInt = nextActiveState ? 1 : 0;
        setUsers(prev => prev.map(u => u.id === user.id ? ({ ...u, is_active: nextActiveInt } as User) : u));
        const token = Cookies.get("token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        const identifier = user.uuid || user.id;
        try {
            const mappedPermissionIds = (user.permissions || []).map((userPerm: any) => {
                if (typeof userPerm === 'number') return userPerm;
                if (typeof userPerm === 'object' && userPerm !== null && userPerm.id) return Number(userPerm.id);
                if (typeof userPerm === 'string') {
                    const found = permissions.find(p => `${p.module}.${p.action}` === userPerm);
                    return found ? Number(found.id) : null;
                }
                return null;
            }).filter(id => id !== null); 
            const res = await fetch(`${baseUrl}/user/${identifier}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ username: user.username, is_active: nextActiveInt, is_superadmin: user.is_superadmin, permission_ids: mappedPermissionIds })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed update");
            triggerSuccess(`${user.username} is now ${nextActiveInt === 1 ? "Active" : "Inactive"}`, true);
        } catch (err: any) {
            setUsers(previousUsers);
            triggerError(err.message || "Failed sync status.");
        }
    };

    const handleConfirmDelete = async () => {
        const token = Cookies.get("token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        try {
            for (const u of rowsToDelete) {
                await fetch(`${baseUrl}/user/${u.uuid || u.id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
            }
            setIsDeleteOpen(false); setRowsToDelete([]); triggerSuccess("Deleted.");
        } catch (err) { triggerError("Delete failed."); }
    };

    return (
        <div className="w-full relative font-satoshi px-6 pb-10">
            {success && <div className="fixed top-6 right-6 z-[300]"><AlertSuccess2 message={success} onClose={() => setSuccess(null)} /></div>}
            {error && <div className="fixed top-6 right-6 z-[300]"><AlertError2 message={error} onClose={() => setError(null)} /></div>}
            
            <div className="mb-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase">User Management</h2>
                    <p className="text-sm text-muted-foreground">Manage and Organize System Access & User Profiles</p>
                </div>
                <button
                    onClick={() => { setEditItem(null); setIsCreateOpen(true); }}
                    className="h-10 px-6 bg-arcipta-blue-primary hover:bg-arcipta-blue-primary/90 text-white rounded-lg shadow-sm transition-all active:scale-95 font-satoshi font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <span className="text-lg leading-none">+</span> Create New
                </button>
            </div>

            <UserFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} roleFilter={roleFilter} onRoleChange={setRoleFilter} dateRange={dateRange} onDateChange={(t: any, v: any) => setDateRange(prev => ({ ...prev, [t]: v }))} onReset={() => { setGlobalFilter(""); setRoleFilter("all"); setDateRange({ start: "", end: "" }); }} />
            
            <div className="mt-4 min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arcipta-blue-primary"></div>
                    </div>
                ) : (
                    <DataTable 
                        data={filteredData} 
                        columns={columns({ 
                            onCreate: () => setIsCreateOpen(true), 
                            onView: (u) => setViewItem(u), 
                            onEdit: (u) => setEditItem(u), 
                            onDeleteSingle: (u) => { setRowsToDelete([u]); setIsDeleteOpen(true); }, 
                            onUpdateStatus: handleUpdateStatus 
                        })} 
                        enableGlobalSearch={false} 
                    />
                )}
            </div>

            <UserFormModal 
                open={isCreateOpen || !!editItem} 
                onOpenChange={(o) => { if (!o) { setIsCreateOpen(false); setEditItem(null); } }} 
                user={editItem} 
                onSuccess={triggerSuccess} 
                onError={triggerError} 
                permissions={permissions} 
            />

            <ViewUserModal open={!!viewItem} onOpenChange={(o) => !o && setViewItem(null)} user={viewItem} />
            <AlertDeleteConfirmation open={isDeleteOpen} onOpenChange={setIsDeleteOpen} onConfirm={handleConfirmDelete} title="Hapus User" description="Tindakan ini akan menghapus akun user secara permanen." />
        </div>
    );
}