"use client";

import { type UserPermission } from "@/constants/user_permissions";
import { userPermissionsData } from "@/data/user_permissions";
import { safeLocalStorageSet } from "./storage-utils";

const STORAGE_KEY = "arcipta_user_permissions";

export const getUserPermissions = (): UserPermission[] => {
    if (typeof window === "undefined") return userPermissionsData;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : userPermissionsData;
};

export const saveUserPermissions = (permissions: UserPermission[]) => {
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(permissions));
};

export const addUserPermissions = (perms: UserPermission[]) => {
    const allPerms = getUserPermissions();
    allPerms.push(...perms);
    saveUserPermissions(allPerms);
};

export const updateUserPermissions = (userId: number, perms: UserPermission[]) => {
    const allPerms = getUserPermissions();
    const filtered = allPerms.filter(p => p.user_id !== userId);
    filtered.push(...perms);
    saveUserPermissions(filtered);
};
