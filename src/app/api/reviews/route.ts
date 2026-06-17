/**
 * GET  /api/reviews      — list reviews (public: approved only; admin: all)
 * POST /api/reviews      — submit a review (public)
 */
import { NextRequest, NextResponse } from "next/server";
import { reviewService } from "@/lib/services/review.service";
import { createReviewSchema } from "@/lib/dto/review.dto";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  if (all) {
    const items = await reviewService.listAll();
    return NextResponse.json({ items });
  }
  const items = await reviewService.listPublic(12);
  const agg = await reviewService.aggregate();
  return NextResponse.json({ items, ...agg });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = createReviewSchema.parse(body);
    const review = await reviewService.create(input);
    return NextResponse.json({ id: review.id, status: "pending" }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    console.error("[POST /api/reviews]", e);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
