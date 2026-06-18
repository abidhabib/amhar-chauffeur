/**
 * Review Service — moderation-gated client testimonials
 */
import { reviewRepository } from "@/lib/repositories/review.repository";
import { activityRepository } from "@/lib/repositories/activity.repository";
import type { CreateReviewInput, UpdateReviewInput } from "@/lib/dto/review.dto";

export const reviewService = {
  async listPublic(limit = 12) {
    return reviewRepository.list({ approvedOnly: true, limit });
  },

  async listAll() {
    return reviewRepository.list();
  },

  async aggregate() {
    return reviewRepository.averageRating();
  },

  async create(input: CreateReviewInput) {
    return reviewRepository.create({
      clientName: input.clientName,
      clientTitle: input.clientTitle || null,
      rating: input.rating,
      body: input.body,
      source: input.source,
      isApproved: false,
      isFeatured: false,
    });
  },

  async update(id: string, input: UpdateReviewInput, actorId: string) {
    const existing = await reviewRepository.findById(id);
    if (!existing) throw new Error("Review not found");

    const updated = await reviewRepository.update(id, {
      isApproved: input.isApproved,
      isFeatured: input.isFeatured,
      body: input.body,
      clientTitle: input.clientTitle,
    });

    if (input.isApproved !== undefined && input.isApproved !== existing.isApproved) {
      await activityRepository.log({
        userId: actorId,
        action: input.isApproved ? "review.approved" : "review.unapproved",
        entityType: "review",
        entityId: id,
        metadata: { clientName: existing.clientName },
      });
    }

    if (input.isFeatured !== undefined && input.isFeatured !== existing.isFeatured) {
      await activityRepository.log({
        userId: actorId,
        action: input.isFeatured ? "review.featured" : "review.unfeatured",
        entityType: "review",
        entityId: id,
        metadata: { clientName: existing.clientName },
      });
    }

    return updated;
  },

  async remove(id: string, actorId: string) {
    const existing = await reviewRepository.findById(id);
    if (!existing) throw new Error("Review not found");
    await reviewRepository.delete(id);
    await activityRepository.log({
      userId: actorId,
      action: "review.deleted",
      entityType: "review",
      entityId: id,
      metadata: { clientName: existing.clientName },
    });
  },
};
