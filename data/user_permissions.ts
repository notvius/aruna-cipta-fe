import { type UserPermission } from "@/constants/user_permissions";
export { type UserPermission } from "@/constants/user_permissions";
import { type User } from "@/constants/users";
import { type Permission } from "@/constants/permissions";

export const userPermissionsData: UserPermission[] = [
  { id: 1, user_id: 1, permission_id: 1, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 2, user_id: 1, permission_id: 2, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 3, user_id: 1, permission_id: 3, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 4, user_id: 1, permission_id: 4, is_allowed: true, created_at: new Date(), updated_at: new Date() },

  { id: 5, user_id: 1, permission_id: 5, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 6, user_id: 1, permission_id: 6, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 7, user_id: 1, permission_id: 7, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 8, user_id: 1, permission_id: 8, is_allowed: true, created_at: new Date(), updated_at: new Date() },

  { id: 9, user_id: 1, permission_id: 9, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 10, user_id: 1, permission_id: 10, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 11, user_id: 1, permission_id: 11, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 12, user_id: 1, permission_id: 12, is_allowed: true, created_at: new Date(), updated_at: new Date() },

  { id: 13, user_id: 2, permission_id: 1, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 14, user_id: 2, permission_id: 2, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 15, user_id: 2, permission_id: 3, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 16, user_id: 2, permission_id: 4, is_allowed: false, created_at: new Date(), updated_at: new Date() },

  { id: 17, user_id: 2, permission_id: 5, is_allowed: true, created_at: new Date(), updated_at: new Date() },

  { id: 18, user_id: 3, permission_id: 1, is_allowed: true, created_at: new Date(), updated_at: new Date() },

  { id: 19, user_id: 3, permission_id: 5, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 20, user_id: 3, permission_id: 7, is_allowed: true, created_at: new Date(), updated_at: new Date() },

  { id: 21, user_id: 4, permission_id: 5, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 22, user_id: 4, permission_id: 6, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 23, user_id: 4, permission_id: 7, is_allowed: true, created_at: new Date(), updated_at: new Date() },
  { id: 24, user_id: 4, permission_id: 8, is_allowed: true, created_at: new Date(), updated_at: new Date() },
];
