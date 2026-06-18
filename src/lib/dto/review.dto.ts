/**
 * Review DTOs
 */
import { z } from "zod";

export const createReviewSchema = z.object({
  clientName: z.string().min(2).max(80),
  clientTitle: z.string().max(80).optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(10, "Review must be at least 10 characters").max(1000),
  source: z.enum(["direct", "google"]).default("direct"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
  isApproved: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  body: z.string().max(1000).optional(),
  clientTitle: z.string().max(80).optional().nullable(),
});

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
