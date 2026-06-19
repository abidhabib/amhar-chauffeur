/**
 * GET /api/fleet/search — search available vehicles by filters
 *
 * Query params:
 *  - category: sedan | suv | van | bus
 *  - vehicleClass: business_class | business_van | first_class | economy
 *  - minSeats: number
 *  - available: boolean (default true)
 *  - sort: price_asc | price_desc | featured | recommended
 */
import { NextRequest, NextResponse } from "next/server";
import { fleetService } from "@/lib/services/fleet.service";
import { fleetRepository } from "@/lib/repositories/fleet.repository";
import { fleetSearchSchema } from "@/lib/dto/fleet.dto";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const input = fleetSearchSchema.parse(params);

    // Always only show visible + available (unless explicitly requested otherwise)
    const items = await fleetRepository.list({
      onlyVisible: true,
      onlyAvailable: input.isAvailable !== false,
      category: input.category as any,
      vehicleClass: input.vehicleClass,
    });

    // Filter by minSeats
    let filtered = items;
    if (input.minSeats) {
      filtered = filtered.filter((f) => f.seats >= input.minSeats!);
    }

    // Sort
    if (input.sort === "price_asc") {
      filtered.sort((a, b) => a.baseFare - b.baseFare);
    } else if (input.sort === "price_desc") {
      filtered.sort((a, b) => b.baseFare - a.baseFare);
    } else if (input.sort === "featured") {
      filtered.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.displayOrder - b.displayOrder);
    } else {
      // recommended: featured first, then display order
      filtered.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.displayOrder - b.displayOrder);
    }

    return NextResponse.json({ items: filtered });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid search params", details: e.issues }, { status: 400 });
    }
    console.error("[GET /api/fleet/search]", e);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
