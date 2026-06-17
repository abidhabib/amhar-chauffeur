/**
 * User Repository (admin staff, not customers)
 */
import { db } from "@/lib/db";
import type { User } from "@prisma/client";

export const userRepository = {
  async list() {
    return db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        createdAt: true,
        _count: { select: { assignedLeads: true, activities: true, notes: true } },
      },
    });
  },

  async findById(id: string) {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        avatarUrl: true,
      },
    });
  },

  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  },

  async create(data: {
    email: string;
    name: string;
    role: string;
    avatarUrl?: string | null;
  }): Promise<User> {
    return db.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        avatarUrl: data.avatarUrl ?? null,
      },
    });
  },

  async updateRole(id: string, role: string): Promise<User> {
    return db.user.update({ where: { id }, data: { role } });
  },

  async setActive(id: string, isActive: boolean): Promise<User> {
    return db.user.update({ where: { id }, data: { isActive } });
  },
};
