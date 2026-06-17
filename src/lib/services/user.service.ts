/**
 * User Service — admin staff management (not customer accounts)
 */
import { userRepository } from "@/lib/repositories/user.repository";
import { activityRepository } from "@/lib/repositories/activity.repository";

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

export const userService = {
  async list() {
    return userRepository.list();
  },

  async getById(id: string) {
    return userRepository.findById(id);
  },

  async setRole(id: string, role: UserRole, actorId: string) {
    const target = await userRepository.findById(id);
    if (!target) throw new Error("User not found");
    if (target.role === role) return target;

    const updated = await userRepository.updateRole(id, role);

    await activityRepository.log({
      userId: actorId,
      action: "user.role_changed",
      entityType: "user",
      entityId: id,
      metadata: { from: target.role, to: role, targetEmail: target.email },
    });

    return updated;
  },

  async setActive(id: string, isActive: boolean, actorId: string) {
    const target = await userRepository.findById(id);
    if (!target) throw new Error("User not found");
    if (target.isActive === isActive) return target;

    const updated = await userRepository.setActive(id, isActive);

    await activityRepository.log({
      userId: actorId,
      action: isActive ? "user.activated" : "user.deactivated",
      entityType: "user",
      entityId: id,
      metadata: { targetEmail: target.email },
    });

    return updated;
  },
};
