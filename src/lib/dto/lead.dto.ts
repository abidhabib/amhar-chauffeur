/**
 * Lead DTOs — input validation + typed shapes
 * Status workflow: new → contacted → quoted → confirmed → cancelled
 */
import { z } from "zod";

export const LEAD_STATUSES = ["new", "contacted", "quoted", "confirmed", "cancelled"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const VEHICLE_CATEGORIES = ["sedan", "suv", "van", "bus"] as const;
export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

// ---------- Create lead (public submission from booking modal) ----------
export const createLeadSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Phone contains invalid characters"),
  countryCode: z.string().default("+966"),
  pickup: z
    .string()
    .min(3, "Please enter a pickup location"),
  destination: z
    .string()
    .min(3, "Please enter a destination"),
  pickupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  pickupTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
  vehicleCategory: z.enum(VEHICLE_CATEGORIES),
  vehicleId: z.string().optional().nullable(),
  passengers: z
    .number()
    .int()
    .min(1, "At least 1 passenger")
    .max(50, "Please contact us for groups larger than 50"),
  luggage: z
    .number()
    .int()
    .min(0, "Luggage cannot be negative")
    .max(50, "Please contact us for excess luggage"),
  notes: z
    .string()
    .max(2000, "Notes are too long")
    .optional()
    .nullable(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

// ---------- Update lead status (admin) ----------
export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
  note: z.string().max(1000).optional(),
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;

// ---------- Assign lead (admin) ----------
export const assignLeadSchema = z.object({
  assignedToId: z.string().nullable(),
  note: z.string().max(1000).optional(),
});

export type AssignLeadInput = z.infer<typeof assignLeadSchema>;

// ---------- Add timeline note ----------
export const addLeadNoteSchema = z.object({
  body: z.string().min(1, "Note cannot be empty").max(2000),
  kind: z.enum(["note", "status_change", "assignment", "quote_sent"]).default("note"),
});

export type AddLeadNoteInput = z.infer<typeof addLeadNoteSchema>;

// ---------- Query / filter ----------
export const leadQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  assignedToId: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["createdAt_desc", "createdAt_asc", "pickupDate_asc"]).default("createdAt_desc"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type LeadQuery = z.infer<typeof leadQuerySchema>;

// ---------- Response shape ----------
export interface LeadWithRelations {
  id: string;
  reference: string;
  status: LeadStatus;
  fullName: string;
  email: string | null;
  phone: string;
  countryCode: string;
  pickup: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  vehicleCategory: VehicleCategory;
  vehicleId: string | null;
  passengers: number;
  luggage: number;
  notes: string | null;
  assignedToId: string | null;
  assignedTo?: { id: string; name: string; email: string } | null;
  timeline: Array<{
    id: string;
    body: string;
    kind: string;
    createdAt: string;
    author: { id: string; name: string };
  }>;
  createdAt: string;
  updatedAt: string;
}

// Status metadata for UI badges
export const STATUS_META: Record<
  LeadStatus,
  { label: string; tone: "neutral" | "info" | "gold" | "green" | "red" }
> = {
  new: { label: "New", tone: "gold" },
  contacted: { label: "Contacted", tone: "info" },
  quoted: { label: "Quoted", tone: "neutral" },
  confirmed: { label: "Confirmed", tone: "green" },
  cancelled: { label: "Cancelled", tone: "red" },
};

export const CATEGORY_META: Record<VehicleCategory, { label: string; description: string }> = {
  sedan: { label: "Sedan", description: "Executive sedans for 2–3 passengers" },
  suv: { label: "SUV", description: "Premium SUVs for up to 5 passengers" },
  van: { label: "Van", description: "Vans and minibuses for groups" },
  bus: { label: "Bus", description: "Luxury coaches for large delegations" },
};
