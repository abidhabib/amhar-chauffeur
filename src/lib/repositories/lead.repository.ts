/**
 * Lead Repository — pure data-access layer.
 * No business logic, no validation, no events. Just CRUD + queries against Prisma.
 */
import { db } from "@/lib/db";
import type { Lead, LeadNote, Prisma } from "@prisma/client";
import type { LeadQuery, LeadStatus } from "@/lib/dto/lead.dto";

function generateReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `AMH-${year}-${rand}`;
}

/**
 * Generate a unique reference, retrying on collision.
 * Pure reference generation — collision check is done at create time
 * via the DB unique constraint (caught as P2002).
 */
async function uniqueReference(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const ref = generateReference();
    const exists = await db.lead.findUnique({
      where: { reference: ref },
      select: { id: true },
    });
    if (!exists) return ref;
  }
  return `AMH-${Date.now().toString().slice(-6)}`;
}

export const leadRepository = {
  async create(data: {
    reference?: string;
    status: LeadStatus;
    fullName: string;
    email: string | null;
    phone: string;
    countryCode: string;
    pickup: string;
    destination: string;
    pickupDate: Date;
    pickupTime: string;
    vehicleCategory: string;
    vehicleId: string | null;
    passengers: number;
    luggage: number;
    notes: string | null;
    assignedToId: string | null;
  }): Promise<Lead> {
    return db.lead.create({
      data: {
        ...data,
        reference: data.reference ?? (await uniqueReference()),
      },
    });
  },

  async findById(id: string) {
    return db.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        timeline: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  async findByReference(reference: string) {
    return db.lead.findUnique({ where: { reference } });
  },

  async list(query: LeadQuery) {
    const where: Prisma.LeadWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.assignedToId) where.assignedToId = query.assignedToId;
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search } },
        { email: { contains: query.search } },
        { phone: { contains: query.search } },
        { reference: { contains: query.search } },
        { pickup: { contains: query.search } },
        { destination: { contains: query.search } },
      ];
    }

    const orderBy: Prisma.LeadOrderByWithRelationInput =
      query.sort === "createdAt_asc"
        ? { createdAt: "asc" }
        : query.sort === "pickupDate_asc"
          ? { pickupDate: "asc" }
          : { createdAt: "desc" };

    const [items, total] = await Promise.all([
      db.lead.findMany({
        where,
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
        },
        orderBy,
        take: query.limit,
        skip: query.offset,
      }),
      db.lead.count({ where }),
    ]);

    return { items, total };
  },

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    return db.lead.update({ where: { id }, data: { status } });
  },

  async assign(id: string, assignedToId: string | null): Promise<Lead> {
    return db.lead.update({ where: { id }, data: { assignedToId } });
  },

  async addNote(data: {
    leadId: string;
    authorId: string;
    body: string;
    kind: string;
  }): Promise<LeadNote> {
    return db.leadNote.create({ data });
  },

  async countByStatus(): Promise<Record<string, number>> {
    const grouped = await db.lead.groupBy({
      by: ["status"],
      _count: true,
    });
    return grouped.reduce(
      (acc, g) => {
        acc[g.status] = g._count;
        return acc;
      },
      {} as Record<string, number>,
    );
  },

  async countByDay(days: number): Promise<Array<{ day: string; count: number }>> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const rows = await db.lead.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
    const buckets = new Map<string, number>();
    for (const r of rows) {
      const day = r.createdAt.toISOString().slice(0, 10);
      buckets.set(day, (buckets.get(day) ?? 0) + 1);
    }
    return Array.from(buckets.entries())
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day));
  },

  async recent(limit = 5) {
    return db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  },
};
