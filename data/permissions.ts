import { type Permission } from "@/constants/permissions";
export { type Permission } from "@/constants/permissions";

export const permissionsData: Permission[] = [
  // === ARTICLES ===
  { id: 1, module: "articles", action: "view" },
  { id: 2, module: "articles", action: "create" },
  { id: 3, module: "articles", action: "edit" },
  { id: 4, module: "articles", action: "delete" },

  // === SERVICES ===
  { id: 5, module: "services", action: "view" },
  { id: 6, module: "services", action: "create" },
  { id: 7, module: "services", action: "edit" },
  { id: 8, module: "services", action: "delete" },

  // === PORTFOLIOS ===
  { id: 9, module: "portfolios", action: "view" },
  { id: 10, module: "portfolios", action: "create" },
  { id: 11, module: "portfolios", action: "edit" },
  { id: 12, module: "portfolios", action: "delete" },

  // === GALLERIES ===
  { id: 13, module: "galleries", action: "view" },
  { id: 14, module: "galleries", action: "create" },
  { id: 15, module: "galleries", action: "edit" },
  { id: 16, module: "galleries", action: "delete" },

  // === TESTIMONIALS ===
  { id: 17, module: "testimonials", action: "view" },
  { id: 18, module: "testimonials", action: "create" },
  { id: 19, module: "testimonials", action: "edit" },
  { id: 20, module: "testimonials", action: "delete" },

  // === FAQS ===
  { id: 21, module: "faqs", action: "view" },
  { id: 22, module: "faqs", action: "create" },
  { id: 23, module: "faqs", action: "edit" },
  { id: 24, module: "faqs", action: "delete" },

  // === USERS (Superadmin only, but still in master list) ===
  { id: 25, module: "users", action: "view" },
  { id: 26, module: "users", action: "create" },
  { id: 27, module: "users", action: "edit" },
  { id: 28, module: "users", action: "delete" },
];
