/**
 * Fleet Service — business logic for fleet CRUD + search + reviews
 */
import { fleetRepository } from "@/lib/repositories/fleet.repository";
import { activityRepository } from "@/lib/repositories/activity.repository";
import type { CreateFleetInput, UpdateFleetInput, FleetWithRelations } from "@/lib/dto/fleet.dto";

function serialize(f: Awaited<ReturnType<typeof fleetRepository.findById>>): FleetWithRelations | null {
  if (!f) return null;
  return {
    ...f,
    reviewCount: (f as any).reviews?.length ?? 0,
    averageRating: 0,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  };
}

export const fleetService = {
  async list(opts?: {
    onlyVisible?: boolean;
    onlyAvailable?: boolean;
    category?: string;
    vehicleClass?: string;
  }) {
    return fleetRepository.list(opts);
  },

  async getById(id: string): Promise<FleetWithRelations | null> {
    const f = await fleetRepository.findById(id);
    if (!f) return null;
    const stats = await fleetRepository.reviewStats(id);
    return {
      ...serialize(f)!,
      reviewCount: stats.count,
      averageRating: stats.average,
    };
  },

  async getBySlug(slug: string): Promise<FleetWithRelations | null> {
    const f = await fleetRepository.findBySlug(slug);
    if (!f) return null;
    const stats = await fleetRepository.reviewStats(f.id);
    return {
      ...serialize(f)!,
      reviewCount: stats.count,
      averageRating: stats.average,
    };
  },

  async create(input: CreateFleetInput, actorId: string) {
    const fleet = await fleetRepository.create({
      name: input.name,
      slug: input.slug,
      category: input.category,
      vehicleClass: input.vehicleClass,
      brand: input.brand,
      model: input.model || null,
      year: input.year ?? null,
      seats: input.seats,
      luggage: input.luggage,
      carryOn: input.carryOn ?? 0,
      baseFare: input.baseFare ?? 0,
      taxRate: input.taxRate ?? 0.15,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      galleryImages: input.galleryImages ?? [],
      features: input.features ?? [],
      displayOrder: input.displayOrder,
      isVisible: input.isVisible,
      isAvailable: input.isAvailable,
      isFeatured: input.isFeatured,
    });

    await activityRepository.log({
      userId: actorId,
      action: "fleet.created",
      entityType: "fleet",
      entityId: fleet.id,
      metadata: { name: fleet.name, vehicleClass: fleet.vehicleClass },
    });

    return serialize(fleet);
  },

  async update(id: string, input: UpdateFleetInput, actorId: string) {
    const existing = await fleetRepository.findById(id);
    if (!existing) throw new Error("Fleet not found");
    const updated = await fleetRepository.update(id, {
      name: input.name,
      slug: input.slug,
      category: input.category,
      vehicleClass: input.vehicleClass,
      brand: input.brand,
      model: input.model,
      year: input.year,
      seats: input.seats,
      luggage: input.luggage,
      carryOn: input.carryOn,
      baseFare: input.baseFare,
      taxRate: input.taxRate,
      description: input.description,
      imageUrl: input.imageUrl,
      galleryImages: input.galleryImages,
      features: input.features,
      displayOrder: input.displayOrder,
      isVisible: input.isVisible,
      isAvailable: input.isAvailable,
      isFeatured: input.isFeatured,
    });

    await activityRepository.log({
      userId: actorId,
      action: "fleet.updated",
      entityType: "fleet",
      entityId: id,
      metadata: { name: updated.name },
    });

    return serialize(updated);
  },

  async remove(id: string, actorId: string) {
    const existing = await fleetRepository.findById(id);
    if (!existing) throw new Error("Fleet not found");
    await fleetRepository.delete(id);
    await activityRepository.log({
      userId: actorId,
      action: "fleet.deleted",
      entityType: "fleet",
      entityId: id,
      metadata: { name: existing.name },
    });
  },

  // ---- Reviews ----
  async listReviews(fleetId: string) {
    return fleetRepository.listReviews(fleetId, { approvedOnly: true });
  },

  async reviewStats(fleetId: string) {
    return fleetRepository.reviewStats(fleetId);
  },

  async createReview(input: {
    fleetId: string;
    customerName: string;
    country: string | null;
    rating: number;
    title: string | null;
    body: string;
  }) {
    return fleetRepository.createReview({
      fleetId: input.fleetId,
      customerName: input.customerName,
      country: input.country,
      rating: input.rating,
      title: input.title,
      body: input.body,
      isVerified: true,
      isApproved: true,
    });
  },
};
