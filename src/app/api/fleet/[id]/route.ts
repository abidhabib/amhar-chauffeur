/**
 * GET    /api/fleet/:slug  — fetch fleet by slug (with reviews + stats)
 * PATCH  /api/fleet/:id   — update (admin)
 * DELETE /api/fleet/:id   — delete (admin)
 *
 * The :param can be either a slug (for public detail page) or an id (for admin).
 * We try slug first, then fall back to id.
 */
import { NextRequest, NextResponse } from "next/server";
import { fleetService } from "@/lib/services/fleet.service";
import { fleetRepository } from "@/lib/repositories/fleet.repository";
import { updateFleetSchema } from "@/lib/dto/fleet.dto";
import { z } from "zod";

const ACTOR_ID_HEADER = "x-amhar-actor-id";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Try slug first (public usage)
  let fleet = await fleetService.getBySlug(id);
  // Fall back to id (admin usage)
  if (!fleet) {
    fleet = await fleetService.getById(id);
  }
  if (!fleet) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(fleet);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const input = updateFleetSchema.parse(body);
    const actorId = req.headers.get(ACTOR_ID_HEADER) || "system";
    const fleet = await fleetService.update(id, input, actorId);
    return NextResponse.json(fleet);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    if (e instanceof Error && e.message === "Fleet not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[PATCH /api/fleet/:id]", e);
    return NextResponse.json({ error: "Failed to update fleet" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const actorId = req.headers.get(ACTOR_ID_HEADER) || "system";
    await fleetService.remove(id, actorId);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && e.message === "Fleet not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[DELETE /api/fleet/:id]", e);
    return NextResponse.json({ error: "Failed to delete fleet" }, { status: 500 });
  }
}
