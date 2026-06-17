/**
 * Fleet DTOs
 */
import { z } from "zod";
import type { VehicleCategory } from "./lead.dto";

export const VEHICLE_CATEGORIES = ["sedan", "suv", "van", "bus"] as const;

export const createFleetSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  category: z.enum(VEHICLE_CATEGORIES),
  brand: z.string().min(1).max(60),
  seats: z.coerce.number().int().min(1).max(60),
  luggage: z.coerce.number().int().min(0).max(60),
  description: z.string().max(1000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  features: z.array(z.string()).default([]),
  displayOrder: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export type CreateFleetInput = z.infer<typeof createFleetSchema>;

export const updateFleetSchema = createFleetSchema.partial();
export type UpdateFleetInput = z.infer<typeof updateFleetSchema>;

export interface FleetWithFeatures {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}
