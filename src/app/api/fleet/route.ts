/**
 * GET  /api/fleet       — list fleet (public: visible, admin: all)
 * POST /api/fleet       — create (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { fleetService } from "@/lib/services/fleet.service";
import { createFleetSchema } from "@/lib/dto/fleet.dto";
import { z } from "zod";

const ACTOR_ID_HEADER = "x-amhar-actor-id";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  const available = url.searchParams.get("available");
  const items = await fleetService.list({
    onlyVisible: !all,
    onlyAvailable: available === null ? undefined : available === "1",
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = createFleetSchema.parse(body);
    const actorId = req.headers.get(ACTOR_ID_HEADER) || "system";
    const fleet = await fleetService.create(input, actorId);
    return NextResponse.json(fleet, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    console.error("[POST /api/fleet]", e);
    return NextResponse.json({ error: "Failed to create fleet entry" }, { status: 500 });
  }
}
