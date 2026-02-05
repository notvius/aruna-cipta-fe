"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/user/UserColumns";
import { type User } from "@/constants/users";
import { getUsers, saveUsers } from "@/utils/user-storage";
import { ViewUserModal } from "@/components/organisms/user/ViewUserModal";
import { UserFormModal } from "@/components/organisms/user/UserFormModal"; // Gunakan Form Tunggal
import { UserFilter } from "@/components/organisms/user/UserFilter";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function UserPage() {
    const [users, setUsers] = React.useState<User[]>([]);
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

    const refresh = React.useCallback(() => {
        setUsers(getUsers());
    }, []);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    const filteredData = React.useMemo(() => {
        return users.filter((item: any) => {
            const userName = item?.username || "";
            const matchesSearch = userName.toLowerCase().includes(globalFilter.toLowerCase());
            
            let matchesRole = true;
            if (roleFilter === "superadmin") {
                matchesRole = item.is_superadmin === true;
            } else if (roleFilter === "admin") {
                matchesRole = item.is_superadmin === false;
            }

            const rawDate = item?.created_at || item?.id;
            const itemDate = rawDate ? new Date(rawDate) : new Date();
            itemDate.setHours(0, 0, 0, 0);

            let matchesDate = true;
            if (dateRange.start) {
                const start = new Date(dateRange.start);
                start.setHours(0, 0, 0, 0);
                if (itemDate < start) matchesDate = false;
            }
            if (dateRange.end) {
                const end = new Date(dateRange.end);
                end.setHours(0, 0, 0, 0);
                if (itemDate > end) matchesDate = false;
            }

            return matchesSearch && matchesRole && matchesDate;
        });
    }, [users, globalFilter, roleFilter, dateRange]);

    const persist = (data: User[]) => {
        setUsers(data);
        saveUsers(data);
    };

    const handleReset = () => {
        setGlobalFilter("");
        setRoleFilter("all");
        setDateRange({ start: "", end: "" });
    };

    const notifySuccess = (msg: string) => {
        setSuccess(msg);
        refresh();
        setTimeout(() => setSuccess(null), 3000);
    };

    const notifyError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 4000);
    };

    const handleUpdateStatus = (index: number, active: boolean) => {
        const newData = [...users];
        newData[index] = { ...newData[index], is_active: active, updated_at: new Date() };
        persist(newData);
        notifySuccess(`User account ${active ? "activated" : "deactivated"} successfully.`);
    };

    const handleConfirmDelete = () => {
        const ids = new Set(rowsToDelete.map(r => r.id));
        const newData = users.filter(r => !ids.has(r.id));
        persist(newData);
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("User record(s) successfully deleted.");
    };

    return (
        <div className="w-full relative font-satoshi px-6 pb-10">
            {success && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4 duration-300">
                    <AlertSuccess2 message={success} onClose={() => setSuccess(null)} />
                </div>
            )}

            {error && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4 duration-300">
                    <AlertError2 message={error} onClose={() => setError(null)} />
                </div>
            )}

            <div className="mb-4 space-y-1 pt-4">
                <h2 className="text-2xl font-bold tracking-tight font-orbitron text-slate-900 uppercase text-shadow-sm">User Management</h2>
                <p className="text-sm text-muted-foreground tracking-tight">Manage and Organize System Access & User Profiles</p>
            </div>

            <UserFilter 
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                roleFilter={roleFilter}
                onRoleChange={setRoleFilter}
                dateRange={dateRange}
                onDateChange={(type: 'start' | 'end', val: string) => 
                    setDateRange((prev) => ({ ...prev, [type]: val }))
                }
                onReset={handleReset}
            />

            <div className="mt-4"> 
                <DataTable
                    data={filteredData}
                    columns={columns({
                        onCreate: () => setIsCreateOpen(true),
                        onView: (u) => setViewItem(u),
                        onEdit: (u) => setEditItem(u),
                        onDeleteSingle: (u) => { setRowsToDelete([u]); setIsDeleteOpen(true); },
                        onUpdateStatus: handleUpdateStatus
                    })}
                    onAddNew={() => setIsCreateOpen(true)}
                    searchPlaceholder="Filter users..."
                    enableGlobalSearch={false}
                />
            </div>

            <UserFormModal
                open={isCreateOpen || !!editItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateOpen(false);
                        setEditItem(null);
                    }
                }}
                user={editItem}
                onSave={(updated) => persist(users.map(u => u.id === updated.id ? updated : u))}
                onSuccess={notifySuccess}
                onError={notifyError}
            />

            {viewItem && (
                <ViewUserModal
                    open={!!viewItem}
                    onOpenChange={(open) => !open && setViewItem(null)}
                    user={viewItem}
                />
            )}

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleConfirmDelete}
                title="Hapus User"
                description={`Tindakan ini akan menghapus ${rowsToDelete.length} user secara permanen dari database.`}
            />
        </div>
    );
}