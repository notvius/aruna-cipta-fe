"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/user/UserColumns";
import { type User } from "@/data/users";
import { getUsers, saveUsers } from "@/utils/user-storage";
import { CreateUserModal } from "@/components/organisms/user/CreateUserModal";
import { AlertDeleteConfirmation } from "@/components/molecules/AlertDeleteConfirmation";
import AlertSuccess2 from "@/components/alert-success-2";

export default function UserPage() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [rowsToDelete, setRowsToDelete] = React.useState<User[]>([]);
    const [success, setSuccess] = React.useState<string | null>(null);

    const refreshUsers = React.useCallback(() => {
        setUsers(getUsers());
    }, []);

    React.useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    const handleDataChange = (newData: User[]) => {
        setUsers(newData);
        saveUsers(newData);
    };

    const sortOptions = [
        { label: "Created At", value: "created_at" },
        { label: "Updated At", value: "updated_at" },
    ];

    const handleDeleteSelected = (selectedRows: User[]) => {
        setRowsToDelete(selectedRows);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const selectedIds = new Set(rowsToDelete.map((row) => row.id));
        const newData = users.filter((row) => !selectedIds.has(row.id));
        setUsers(newData);
        saveUsers(newData);
        setIsDeleteDialogOpen(false);
        setRowsToDelete([]);
        setSuccess("User(s) deleted successfully");
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="w-full">
            {success && <AlertSuccess2 message={success} />}

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
            </div>

            <DataTable
                data={users}
                columns={columns}
                onDataChange={handleDataChange}
                sortOptions={sortOptions}
                onDeleteSelected={handleDeleteSelected}
                onAddNew={() => setIsCreateModalOpen(true)}
            />

            <CreateUserModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={refreshUsers}
            />

            <AlertDeleteConfirmation
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Delete User"
                description={`Are you sure you want to delete ${rowsToDelete.length} user(s)?`}
            />
        </div>
    );
}