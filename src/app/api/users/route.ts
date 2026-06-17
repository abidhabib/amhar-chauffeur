/**
 * GET /api/users — list admin staff
 */
import { NextResponse } from "next/server";
import { userService } from "@/lib/services/user.service";

export async function GET() {
  const items = await userService.list();
  return NextResponse.json({ items });
}
