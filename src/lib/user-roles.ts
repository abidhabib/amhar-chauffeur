/**
 * Shared user role constants + types — pure data, no DB imports.
 *
 * Extracted from user.service.ts so client components can import these
 * without dragging in the Prisma client + pg driver.
 */

export const USER_ROLES = ["super_admin", "manager", "operator"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_META: Record<UserRole, { label: string; description: string }> = {
  super_admin: {
    label: "Super Admin",
    description: "Full system access including user management and audit logs",
  },
  manager: {
    label: "Manager",
    description: "Manage leads, fleet, reviews, and view audit logs",
  },
  operator: {
    label: "Operator",
    description: "Handle assigned leads, add notes, update statuses",
  },
};
