/**
 * Fleet Service
 */
import { fleetRepository } from "@/lib/repositories/fleet.repository";
import { activityRepository } from "@/lib/repositories/activity.repository";
import type { CreateFleetInput, UpdateFleetInput, FleetWithFeatures } from "@/lib/dto/fleet.dto";

function serialize(f: Awaited<ReturnType<typeof fleetRepository.findById>>): FleetWithFeatures | null {
  if (!f) return null;
  return {
    ...f,
    features: f.features ? (JSON.parse(f.features) as string[]) : [],
  };
}

export const fleetService = {
  async list(opts?: { onlyVisible?: boolean; category?: string }) {
    const items = await fleetRepository.list(opts);
    return items;
  },

  async getById(id: string): Promise<FleetWithFeatures | null> {
    return serialize(await fleetRepository.findById(id));
  },

  async create(input: CreateFleetInput, actorId: string) {
    const fleet = await fleetRepository.create({
      name: input.name,
      slug: input.slug,
      category: input.category,
      brand: input.brand,
      seats: input.seats,
      luggage: input.luggage,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      features: input.features,
      displayOrder: input.displayOrder,
      isVisible: input.isVisible,
    });

    await activityRepository.log({
      userId: actorId,
      action: "fleet.created",
      entityType: "fleet",
      entityId: fleet.id,
      metadata: { name: fleet.name, category: fleet.category },
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
      brand: input.brand,
      seats: input.seats,
      luggage: input.luggage,
      description: input.description,
      imageUrl: input.imageUrl,
      features: input.features,
      displayOrder: input.displayOrder,
      isVisible: input.isVisible,
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
};
