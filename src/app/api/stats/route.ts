/**
 * GET /api/stats — dashboard analytics
 */
import { NextResponse } from "next/server";
import { leadService } from "@/lib/services/lead.service";
import { reviewService } from "@/lib/services/review.service";
import { fleetService } from "@/lib/services/fleet.service";
import { activityRepository } from "@/lib/repositories/activity.repository";

export async function GET() {
  const [leadStats, reviewAgg, fleet, recentActivity] = await Promise.all([
    leadService.stats(),
    reviewService.aggregate(),
    fleetService.list({ onlyVisible: false }),
    activityRepository.recent(15),
  ]);

  const statuses = ["new", "contacted", "quoted", "confirmed", "cancelled"] as const;
  const byStatus = statuses.map((s) => ({
    status: s,
    count: (leadStats.byStatus as Record<string, number>)[s] ?? 0,
  }));

  return NextResponse.json({
    leads: {
      total: leadStats.total,
      byStatus,
      byDay: leadStats.byDay,
      recent: leadStats.recent,
    },
    reviews: reviewAgg,
    fleetCount: fleet.length,
    recentActivity,
  });
}
