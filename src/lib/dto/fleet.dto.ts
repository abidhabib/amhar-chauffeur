/**
 * Fleet DTOs — validation schemas + types
 */
import { z } from "zod";
import type { VehicleCategory } from "./lead.dto";

export const VEHICLE_CATEGORIES = ["sedan", "suv", "van", "bus"] as const;

export const VEHICLE_CLASSES = [
  "business_class",
  "business_van",
  "first_class",
  "economy",
] as const;
export type VehicleClass = (typeof VEHICLE_CLASSES)[number];

export const VEHICLE_CLASS_META: Record<VehicleClass, { label: string; tagline: string }> = {
  business_class: { label: "Business Class", tagline: "Executive sedans for 2-3 passengers" },
  business_van: { label: "Business Van", tagline: "Premium vans for groups up to 7" },
  first_class: { label: "First Class", tagline: "Top-tier luxury for the discerning" },
  economy: { label: "Economy", tagline: "Comfort without compromise" },
};

// Standard amenity slugs used across the fleet
export const AMENITY_SLUGS = [
  "meet_greet",
  "flight_tracking",
  "free_waiting",
  "free_cancellation",
  "phone_chargers",
  "bottled_water",
  "sanitizing_wipes",
  "premium_interior",
  "wifi",
  "climate_control",
  "leather_seats",
  "privacy_partition",
] as const;

export const AMENITY_META: Record<
  (typeof AMENITY_SLUGS)[number],
  { label: string; icon: string }
> = {
  meet_greet: { label: "Meet & Greet", icon: "Hand" },
  flight_tracking: { label: "Flight Tracking", icon: "Plane" },
  free_waiting: { label: "Free Waiting Time", icon: "Clock" },
  free_cancellation: { label: "Free Cancellation", icon: "ShieldCheck" },
  phone_chargers: { label: "Phone Chargers", icon: "BatteryCharging" },
  bottled_water: { label: "Bottled Water", icon: "Droplet" },
  sanitizing_wipes: { label: "Sanitizing Wipes", icon: "Sparkles" },
  premium_interior: { label: "Premium Interior", icon: "Gem" },
  wifi: { label: "Wi-Fi", icon: "Wifi" },
  climate_control: { label: "Climate Control", icon: "Thermometer" },
  leather_seats: { label: "Leather Seats", icon: "Armchair" },
  privacy_partition: { label: "Privacy Partition", icon: "Divide" },
};

export const createFleetSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  category: z.enum(VEHICLE_CATEGORIES),
  vehicleClass: z.enum(VEHICLE_CLASSES),
  brand: z.string().min(1).max(60),
  model: z.string().max(60).optional().nullable(),
  year: z.coerce.number().int().min(1990).max(2030).optional().nullable(),
  seats: z.coerce.number().int().min(1).max(60),
  luggage: z.coerce.number().int().min(0).max(60),
  carryOn: z.coerce.number().int().min(0).max(20).default(0),
  baseFare: z.coerce.number().min(0).default(0),
  taxRate: z.coerce.number().min(0).max(1).default(0.15),
  description: z.string().max(2000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  galleryImages: z.array(z.string()).default([]),
  features: z.array(z.enum(AMENITY_SLUGS)).default([]),
  displayOrder: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type CreateFleetInput = z.infer<typeof createFleetSchema>;

export const updateFleetSchema = createFleetSchema.partial();
export type UpdateFleetInput = z.infer<typeof updateFleetSchema>;

// Search filters used by the booking flow
export const fleetSearchSchema = z.object({
  category: z.enum(VEHICLE_CATEGORIES).optional(),
  vehicleClass: z.enum(VEHICLE_CLASSES).optional(),
  minSeats: z.coerce.number().int().min(1).max(60).optional(),
  isAvailable: z.boolean().optional().default(true),
  sort: z.enum(["price_asc", "price_desc", "featured", "recommended"]).default("recommended"),
});

export type FleetSearchInput = z.infer<typeof fleetSearchSchema>;

export interface FleetWithRelations {
  id: string;
  name: string;
  slug: string;
  category: VehicleCategory;
  vehicleClass: VehicleClass;
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
  reviewCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}
