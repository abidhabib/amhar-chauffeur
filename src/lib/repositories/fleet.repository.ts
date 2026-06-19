/**
 * Fleet Repository — data access only.
 * Features, galleryImages stored as JSON strings in SQLite; (de)serialized here.
 */
import { db } from "@/lib/db";
import type { Fleet, Prisma } from "@prisma/client";
import type { VehicleCategory } from "@/lib/dto/lead.dto";

type FleetCreateData = {
  name: string;
  slug: string;
  category: VehicleCategory;
  vehicleClass: string;
  brand: string;
  model: string | null;
  year: number | null;
  seats: number;
  luggage: number;
  carryOn: number;
  baseFare: number;
  taxRate: number;
  description: string | null;
  imageUrl: string | null;
  galleryImages: string[];
  features: string[];
  displayOrder: number;
  isVisible: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
};

function serializeWithRelations(f: any) {
  // Postgres native arrays — no JSON parsing needed
  return {
    ...f,
    galleryImages: f.galleryImages ?? [],
    features: f.features ?? [],
    images: f.images ?? [],
    reviews: f.reviews ?? [],
  };
}

export const fleetRepository = {
  async create(data: FleetCreateData): Promise<Fleet> {
    return db.fleet.create({
      data: {
        ...data,
        // Postgres native arrays — pass directly
        galleryImages: data.galleryImages,
        features: data.features,
      },
    });
  },

  async findById(id: string) {
    const f = await db.fleet.findUnique({
      where: { id },
      include: {
        reviews: { where: { isApproved: true }, orderBy: { reviewDate: "desc" } },
        images: { orderBy: { displayOrder: "asc" } },
      },
    });
    return f ? serializeWithRelations(f) : null;
  },

  async findBySlug(slug: string) {
    const f = await db.fleet.findUnique({
      where: { slug },
      include: {
        reviews: { where: { isApproved: true }, orderBy: { reviewDate: "desc" } },
        images: { orderBy: { displayOrder: "asc" } },
      },
    });
    return f ? serializeWithRelations(f) : null;
  },

  async list(opts?: {
    onlyVisible?: boolean;
    onlyAvailable?: boolean;
    category?: VehicleCategory;
    vehicleClass?: string;
  }) {
    const where: Prisma.FleetWhereInput = {};
    if (opts?.onlyVisible) where.isVisible = true;
    if (opts?.onlyAvailable) where.isAvailable = true;
    if (opts?.category) where.category = opts.category;
    if (opts?.vehicleClass) where.vehicleClass = opts.vehicleClass;
    const items = await db.fleet.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: {
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
    });
    return items.map((f) => {
      const reviewCount = f.reviews.length;
      const averageRating =
        reviewCount > 0
          ? f.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;
      const { reviews, ...rest } = f;
      return {
        ...serializeWithRelations(rest),
        reviewCount,
        averageRating: Number(averageRating.toFixed(1)),
      };
    });
  },

  async update(id: string, data: Partial<FleetCreateData>): Promise<Fleet> {
    const payload: Prisma.FleetUpdateInput = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.category !== undefined) payload.category = data.category;
    if (data.vehicleClass !== undefined) payload.vehicleClass = data.vehicleClass;
    if (data.brand !== undefined) payload.brand = data.brand;
    if (data.model !== undefined) payload.model = data.model;
    if (data.year !== undefined) payload.year = data.year;
    if (data.seats !== undefined) payload.seats = data.seats;
    if (data.luggage !== undefined) payload.luggage = data.luggage;
    if (data.carryOn !== undefined) payload.carryOn = data.carryOn;
    if (data.baseFare !== undefined) payload.baseFare = data.baseFare;
    if (data.taxRate !== undefined) payload.taxRate = data.taxRate;
    if (data.description !== undefined) payload.description = data.description;
    if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl;
    if (data.galleryImages !== undefined) payload.galleryImages = data.galleryImages;
    if (data.features !== undefined) payload.features = data.features;
    if (data.displayOrder !== undefined) payload.displayOrder = data.displayOrder;
    if (data.isVisible !== undefined) payload.isVisible = data.isVisible;
    if (data.isAvailable !== undefined) payload.isAvailable = data.isAvailable;
    if (data.isFeatured !== undefined) payload.isFeatured = data.isFeatured;
    return db.fleet.update({ where: { id }, data: payload });
  },

  async delete(id: string): Promise<void> {
    await db.fleet.delete({ where: { id } });
  },

  // ---- Reviews ----
  async createReview(data: {
    fleetId: string;
    customerName: string;
    country: string | null;
    rating: number;
    title: string | null;
    body: string;
    isVerified?: boolean;
    isApproved?: boolean;
  }) {
    return db.fleetReview.create({
      data: {
        fleetId: data.fleetId,
        customerName: data.customerName,
        country: data.country,
        rating: data.rating,
        title: data.title,
        body: data.body,
        isVerified: data.isVerified ?? true,
        isApproved: data.isApproved ?? true,
      },
    });
  },

  async listReviews(fleetId: string, opts?: { approvedOnly?: boolean }) {
    const where: Prisma.FleetReviewWhereInput = { fleetId };
    if (opts?.approvedOnly) where.isApproved = true;
    return db.fleetReview.findMany({
      where,
      orderBy: { reviewDate: "desc" },
    });
  },

  async reviewStats(fleetId: string) {
    const reviews = await db.fleetReview.findMany({
      where: { fleetId, isApproved: true },
      select: { rating: true },
    });
    const count = reviews.length;
    const average = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      breakdown[r.rating] = (breakdown[r.rating] ?? 0) + 1;
    });
    return {
      count,
      average: Number(average.toFixed(1)),
      breakdown,
    };
  },
};
