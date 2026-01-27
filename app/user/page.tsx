"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/organisms/user/UserColumns";
import { type User } from "@/data/users";
import { getUsers, saveUsers } from "@/utils/user-storage";
import { CreateUserModal } from "@/components/organisms/user/CreateUserModal";

export default function UserPage() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

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
        const selectedIds = new Set(selectedRows.map((row) => row.id));
        const newData = users.filter((row) => !selectedIds.has(row.id));
        setUsers(newData);
        saveUsers(newData);
    };

    return (
        <div className="w-full">
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
        </div>
    );
}