/**
 * Fleet Repository — data access only.
 * Features stored as JSON string in SQLite; (de)serialized here.
 */
import { db } from "@/lib/db";
import type { Fleet, Prisma } from "@prisma/client";
import type { VehicleCategory } from "@/lib/dto/lead.dto";

type FleetCreateData = {
  name: string;
  slug: string;
  category: VehicleCategory;
  brand: string;
  seats: number;
  luggage: number;
  description: string | null;
  imageUrl: string | null;
  features: string[];
  displayOrder: number;
  isVisible: boolean;
};

function serialize(f: Fleet) {
  return {
    ...f,
    features: f.features ? (JSON.parse(f.features) as string[]) : [],
  };
}

export const fleetRepository = {
  async create(data: FleetCreateData): Promise<Fleet> {
    return db.fleet.create({
      data: { ...data, features: JSON.stringify(data.features) },
    });
  },

  async findById(id: string) {
    return db.fleet.findUnique({ where: { id } });
  },

  async findBySlug(slug: string) {
    return db.fleet.findUnique({ where: { slug } });
  },

  async list(opts?: { onlyVisible?: boolean; category?: VehicleCategory }) {
    const where: Prisma.FleetWhereInput = {};
    if (opts?.onlyVisible) where.isVisible = true;
    if (opts?.category) where.category = opts.category;
    const items = await db.fleet.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    return items.map(serialize);
  },

  async update(id: string, data: Partial<FleetCreateData>): Promise<Fleet> {
    const payload: Prisma.FleetUpdateInput = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.category !== undefined) payload.category = data.category;
    if (data.brand !== undefined) payload.brand = data.brand;
    if (data.seats !== undefined) payload.seats = data.seats;
    if (data.luggage !== undefined) payload.luggage = data.luggage;
    if (data.description !== undefined) payload.description = data.description;
    if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl;
    if (data.features !== undefined) payload.features = JSON.stringify(data.features);
    if (data.displayOrder !== undefined) payload.displayOrder = data.displayOrder;
    if (data.isVisible !== undefined) payload.isVisible = data.isVisible;
    return db.fleet.update({ where: { id }, data: payload });
  },

  async delete(id: string): Promise<void> {
    await db.fleet.delete({ where: { id } });
  },
};
