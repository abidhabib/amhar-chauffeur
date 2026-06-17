/**
 * GET /api/activity — audit log list
 */
import { NextRequest, NextResponse } from "next/server";
import { activityRepository } from "@/lib/repositories/activity.repository";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "100", 10);
  const entityType = url.searchParams.get("entityType") || undefined;
  const items = await activityRepository.list({ limit, entityType });
  return NextResponse.json({ items });
}
