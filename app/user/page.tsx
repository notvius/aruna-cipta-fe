"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/user/UserColumns";
import { type User } from "@/constants/users";
import { getUsers, saveUsers } from "@/utils/user-storage";
import { CreateUserModal } from "@/components/organisms/user/CreateUserModal";
import { EditUserModal } from "@/components/organisms/user/EditUserModal";
import { ViewUserModal } from "@/components/organisms/user/ViewUserModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";
import AlertError2 from "@/components/alert-error-2";

export default function UserPage() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [editItem, setEditItem] = React.useState<User | null>(null);
    const [viewItem, setViewItem] = React.useState<User | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<User[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const refresh = React.useCallback(() => setUsers(getUsers()), []);
    React.useEffect(() => refresh(), [refresh]);

    const persist = (data: User[]) => {
        setUsers(data);
        saveUsers(data);
    };

    const notifySuccess = (msg: string) => {
        setSuccess(msg);
        refresh();
        setTimeout(() => setSuccess(null), 2000);
    };

    const handleUpdateStatus = (index: number, active: boolean) => {
        const newData = [...users];
        newData[index] = { ...newData[index], is_active: active, updated_at: new Date() };
        persist(newData);
        notifySuccess(`User ${active ? "activated" : "deactivated"}`);
    };

    const confirmDelete = () => {
        const ids = new Set(rowsToDelete.map(r => r.id));
        persist(users.filter(r => !ids.has(r.id)));
        setIsDeleteOpen(false);
        setRowsToDelete([]);
        notifySuccess("User(s) deleted successfully");
    };

    return (
        <div className="w-full relative">
            {success && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4">
                    <AlertSuccess2 message={success} onClose={() => setSuccess(null)} />
                </div>
            )}
            {error && (
                <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-4">
                    <AlertError2 message={error} onClose={() => setError(null)} />
                </div>
            )}

            <h2 className="text-2xl font-bold tracking-tight mb-4">User Management</h2>

            <DataTable
                data={users}
                columns={columns({
                    onCreate: () => setIsCreateOpen(true),
                    onView: (u) => setViewItem(u),
                    onEdit: (u) => setEditItem(u),
                    onDeleteSingle: (u) => { setRowsToDelete([u]); setIsDeleteOpen(true); },
                    onUpdateStatus: handleUpdateStatus
                })}
                onDataChange={persist}
                onDeleteSelected={(rows) => { setRowsToDelete(rows); setIsDeleteOpen(true); }}
            />

            <CreateUserModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={() => notifySuccess("User created!")} onError={setError} />

            {/* MODAL EDIT */}
            {editItem && (
                <EditUserModal
                    open={!!editItem}
                    onOpenChange={(open: boolean) => !open && setEditItem(null)}
                    user={editItem}
                    onSave={(updated) => persist(users.map(u => u.id === updated.id ? updated : u))}
                    onSuccess={() => notifySuccess("User updated!")}
                    onError={setError}
                />
            )}

            {/* MODAL VIEW */}
            {viewItem && (
                <ViewUserModal 
                    open={!!viewItem} 
                    onOpenChange={(open: boolean) => !open && setViewItem(null)} 
                    user={viewItem} 
                />
            )}

            <AlertDeleteConfirmation
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={confirmDelete}
                title="Delete User"
                description={`Delete ${rowsToDelete.length} user(s)?`}
            />
        </div>
    );
}