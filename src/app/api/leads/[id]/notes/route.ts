/**
 * POST /api/leads/:id/notes — add a timeline note (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { leadService } from "@/lib/services/lead.service";
import { addLeadNoteSchema } from "@/lib/dto/lead.dto";
import { z } from "zod";

const ACTOR_ID_HEADER = "x-amhar-actor-id";
function getActor(req: NextRequest): string {
  return req.headers.get(ACTOR_ID_HEADER) || "system";
}
function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const input = addLeadNoteSchema.parse(body);
    const note = await leadService.addNote(id, input, getActor(req), getClientIp(req));
    return NextResponse.json(note, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    if (e instanceof Error && e.message === "Lead not found") {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    console.error("[POST /api/leads/:id/notes]", e);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
