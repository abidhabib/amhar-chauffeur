/**
 * User Service — admin staff management (not customer accounts)
 *
 * NOTE: Role constants/types live in `@/lib/user-roles.ts` (no DB imports).
 * Client components should import from there to avoid pulling in Prisma/pg.
 */
import { userRepository } from "@/lib/repositories/user.repository";
import { activityRepository } from "@/lib/repositories/activity.repository";

// Re-export for backwards compatibility (server-side imports)
export { USER_ROLES, ROLE_META, type UserRole } from "@/lib/user-roles";

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
