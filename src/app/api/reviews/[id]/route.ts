/**
 * PATCH  /api/reviews/:id  — approve / feature / edit (admin)
 * DELETE /api/reviews/:id  — delete (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { reviewService } from "@/lib/services/review.service";
import { updateReviewSchema } from "@/lib/dto/review.dto";
import { z } from "zod";

const ACTOR_ID_HEADER = "x-amhar-actor-id";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const input = updateReviewSchema.parse(body);
    const actorId = req.headers.get(ACTOR_ID_HEADER) || "system";
    const review = await reviewService.update(id, input, actorId);
    return NextResponse.json(review);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    if (e instanceof Error && e.message === "Review not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[PATCH /api/reviews/:id]", e);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const actorId = req.headers.get(ACTOR_ID_HEADER) || "system";
    await reviewService.remove(id, actorId);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && e.message === "Review not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[DELETE /api/reviews/:id]", e);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
