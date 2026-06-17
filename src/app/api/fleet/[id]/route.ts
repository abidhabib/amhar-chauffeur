/**
 * PATCH  /api/fleet/:id  — update (admin)
 * DELETE /api/fleet/:id  — delete (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { fleetService } from "@/lib/services/fleet.service";
import { updateFleetSchema } from "@/lib/dto/fleet.dto";
import { z } from "zod";

const ACTOR_ID_HEADER = "x-amhar-actor-id";

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
