/**
 * Activity Log Repository — audit trail
 */
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const activityRepository = {
  async log(data: {
    userId: string | null;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown> | null;
    ipAddress?: string | null;
    leadId?: string | null;
  }) {
    return db.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        ipAddress: data.ipAddress ?? null,
        leadId: data.leadId ?? null,
      },
    });
  },

  async list(opts?: { limit?: number; entityType?: string; entityId?: string }) {
    const where: Prisma.ActivityLogWhereInput = {};
    if (opts?.entityType) where.entityType = opts.entityType;
    if (opts?.entityId) where.entityId = opts.entityId;
    return db.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: opts?.limit ?? 100,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  },

  async forLead(leadId: string) {
    return db.activityLog.findMany({
      where: {
        OR: [{ leadId }, { entityId: leadId, entityType: "lead" }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  },

  async recent(limit = 20) {
    return db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  },
};
