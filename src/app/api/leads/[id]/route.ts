/**
 * GET    /api/leads/:id            — fetch lead with timeline
 * PATCH  /api/leads/:id            — update status or assignment (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { leadService } from "@/lib/services/lead.service";
import { updateLeadStatusSchema, assignLeadSchema } from "@/lib/dto/lead.dto";
import { z } from "zod";

// Mock "current user" — in a real app this would come from NextAuth session
const ACTOR_ID_HEADER = "x-amhar-actor-id";
function getActor(req: NextRequest): string {
  return req.headers.get(ACTOR_ID_HEADER) || "system";
}

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const lead = await leadService.getById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const actorId = getActor(req);
    const ip = getClientIp(req);

    // Dispatch by body shape: { status } -> updateStatus; { assignedToId } -> assign
    if (typeof body.status === "string") {
      const input = updateLeadStatusSchema.parse(body);
      const lead = await leadService.updateStatus(id, input, actorId, ip);
      return NextResponse.json(lead);
    }

    if ("assignedToId" in body) {
      const input = assignLeadSchema.parse(body);
      const lead = await leadService.assign(id, input, actorId, ip);
      return NextResponse.json(lead);
    }

    return NextResponse.json({ error: "No valid action in body" }, { status: 400 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    if (e instanceof Error && e.message === "Lead not found") {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    console.error("[PATCH /api/leads/:id]", e);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
