/**
 * GET  /api/fleet/:id/reviews — list reviews + rating stats
 * POST /api/fleet/:id/reviews — submit a new review
 */
import { NextRequest, NextResponse } from "next/server";
import { fleetService } from "@/lib/services/fleet.service";
import { z } from "zod";

const createReviewSchema = z.object({
  customerName: z.string().min(2).max(80),
  country: z.string().max(80).optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(120).optional().nullable(),
  body: z.string().min(10, "Review must be at least 10 characters").max(1000),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // The :id param can be either a fleet ID or a slug. Resolve to ID.
  let fleetId = id;
  // Try to find by slug first (slugs don't start with "cm" like CUIDs)
  if (!id.startsWith("cm") || id.length < 20) {
    const bySlug = await fleetService.getBySlug(id);
    if (bySlug) {
      fleetId = bySlug.id;
    }
  }
  const [items, stats] = await Promise.all([
    fleetService.listReviews(fleetId),
    fleetService.reviewStats(fleetId),
  ]);
  return NextResponse.json({ items, stats });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const input = createReviewSchema.parse(body);
    const review = await fleetService.createReview({
      fleetId: id,
      ...input,
    });
    return NextResponse.json(review, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    console.error("[POST /api/fleet/:id/reviews]", e);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
