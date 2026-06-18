/**
 * GET  /api/leads          — list leads (admin)
 * POST /api/leads          — create lead (public submission)
 */
import { NextRequest, NextResponse } from "next/server";
import { leadService } from "@/lib/services/lead.service";
import { leadQuerySchema, createLeadSchema } from "@/lib/dto/lead.dto";
import { z } from "zod";

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || null;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const query = leadQuerySchema.parse(params);
    const { items, total } = await leadService.list(query);
    return NextResponse.json({ items, total });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query", details: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to list leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = createLeadSchema.parse(body);
    const ip = getClientIp(req);
    const lead = await leadService.createFromPublic(input, ip);
    return NextResponse.json({ reference: lead.reference, id: lead.id }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    console.error("[POST /api/leads]", e);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
