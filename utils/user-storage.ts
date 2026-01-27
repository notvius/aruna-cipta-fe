"use client";

import { type User } from "@/constants/users";
import { userData } from "@/data/users";
import { safeLocalStorageSet } from "./storage-utils";

const STORAGE_KEY = "arcipta_users";

export const getUsers = (): User[] => {
    if (typeof window === "undefined") return userData;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : userData;
};

export const saveUsers = (users: User[]) => {
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(users));
};

export const addUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
};

export const updateUser = (updatedUser: User) => {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
    }
};

export const deleteUser = (id: number) => {
    const users = getUsers();
    const filtered = users.filter((u) => u.id !== id);
    saveUsers(filtered);
};
