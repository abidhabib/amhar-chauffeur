/**
 * PATCH /api/users/:id — update role or active state (admin)
 * Body: { role?: "super_admin"|"manager"|"operator", isActive?: boolean }
 */
import { NextRequest, NextResponse } from "next/server";
import { userService, USER_ROLES } from "@/lib/services/user.service";
import { z } from "zod";

const ACTOR_ID_HEADER = "x-amhar-actor-id";

const schema = z.object({
  role: z.enum(USER_ROLES).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const input = schema.parse(body);
    const actorId = req.headers.get(ACTOR_ID_HEADER) || "system";

    if (input.role) {
      await userService.setRole(id, input.role, actorId);
    }
    if (typeof input.isActive === "boolean") {
      await userService.setActive(id, input.isActive, actorId);
    }

    const updated = await userService.getById(id);
    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: e.issues }, { status: 422 });
    }
    if (e instanceof Error && e.message === "User not found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.error("[PATCH /api/users/:id]", e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
