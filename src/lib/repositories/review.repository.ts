/**
 * Review Repository
 */
import { db } from "@/lib/db";
import type { Review, Prisma } from "@prisma/client";

export const reviewRepository = {
  async create(data: {
    clientName: string;
    clientTitle: string | null;
    rating: number;
    body: string;
    source: string;
    isApproved?: boolean;
    isFeatured?: boolean;
  }): Promise<Review> {
    return db.review.create({
      data: {
        clientName: data.clientName,
        clientTitle: data.clientTitle,
        rating: data.rating,
        body: data.body,
        source: data.source,
        isApproved: data.isApproved ?? false,
        isFeatured: data.isFeatured ?? false,
      },
    });
  },

  async findById(id: string) {
    return db.review.findUnique({ where: { id } });
  },

  async list(opts?: { approvedOnly?: boolean; featuredOnly?: boolean; limit?: number }) {
    const where: Prisma.ReviewWhereInput = {};
    if (opts?.approvedOnly) where.isApproved = true;
    if (opts?.featuredOnly) where.isFeatured = true;
    return db.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: opts?.limit ?? 100,
    });
  },

  async update(id: string, data: Partial<{
    isApproved: boolean;
    isFeatured: boolean;
    body: string;
    clientTitle: string | null;
  }>): Promise<Review> {
    return db.review.update({ where: { id }, data });
  },

  async delete(id: string): Promise<void> {
    await db.review.delete({ where: { id } });
  },

  async averageRating() {
    const agg = await db.review.aggregate({
      where: { isApproved: true },
      _avg: { rating: true },
      _count: true,
    });
    return {
      average: agg._avg.rating ? Number(agg._avg.rating.toFixed(1)) : 0,
      count: agg._count,
    };
  },
};
