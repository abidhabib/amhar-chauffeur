/**
 * Lead Service — business logic, validation, event emission.
 * Repositories handle raw data; services orchestrate + emit events.
 * API routes / server actions are thin: they call services.
 */
import { leadRepository } from "@/lib/repositories/lead.repository";
import { activityRepository } from "@/lib/repositories/activity.repository";
import { userRepository } from "@/lib/repositories/user.repository";
import { emitLeadEvent, LEAD_EVENT_NAMES } from "@/lib/events/lead-events";
import { db } from "@/lib/db";
import type {
  CreateLeadInput,
  UpdateLeadStatusInput,
  AssignLeadInput,
  AddLeadNoteInput,
  LeadQuery,
  LeadStatus,
} from "@/lib/dto/lead.dto";

export const leadService = {
  /** Public submission from the booking modal — no actor (anonymous). */
  async createFromPublic(input: CreateLeadInput, ipAddress?: string | null) {
    const lead = await leadRepository.create({
      status: "new",
      fullName: input.fullName,
      email: input.email || null,
      phone: input.phone,
      countryCode: input.countryCode,
      pickup: input.pickup,
      destination: input.destination,
      pickupDate: new Date(`${input.pickupDate}T00:00:00Z`),
      pickupTime: input.pickupTime,
      vehicleCategory: input.vehicleCategory,
      vehicleId: input.vehicleId || null,
      passengers: input.passengers,
      luggage: input.luggage,
      notes: input.notes || null,
      assignedToId: null,
    });

    // Fire-and-forget event listeners (activity log, future notifications)
    emitLeadEvent(LEAD_EVENT_NAMES.CREATED, {
      leadId: lead.id,
      reference: lead.reference,
      actorId: null,
      ipAddress,
      metadata: { status: lead.status, vehicleCategory: lead.vehicleCategory },
    });

    await activityRepository.log({
      userId: null,
      action: LEAD_EVENT_NAMES.CREATED,
      entityType: "lead",
      entityId: lead.id,
      leadId: lead.id,
      metadata: { reference: lead.reference, fullName: lead.fullName, ipAddress },
      ipAddress,
    });

    return lead;
  },

  async getById(id: string) {
    return leadRepository.findById(id);
  },

  async list(query: LeadQuery) {
    return leadRepository.list(query);
  },

  async updateStatus(
    id: string,
    input: UpdateLeadStatusInput,
    actorId: string,
    ipAddress?: string | null,
  ) {
    const current = await leadRepository.findById(id);
    if (!current) throw new Error("Lead not found");

    const previousStatus = current.status as LeadStatus;
    if (previousStatus === input.status) return current;

    const updated = await leadRepository.updateStatus(id, input.status);

    // Add timeline entry
    if (actorId) {
      await leadRepository.addNote({
        leadId: id,
        authorId: actorId,
        body: input.note || `Status changed from "${previousStatus}" to "${input.status}".`,
        kind: "status_change",
      });
    }

    emitLeadEvent(LEAD_EVENT_NAMES.STATUS_CHANGED, {
      leadId: id,
      reference: current.reference,
      actorId,
      ipAddress,
      metadata: { from: previousStatus, to: input.status },
    });

    await activityRepository.log({
      userId: actorId,
      action: LEAD_EVENT_NAMES.STATUS_CHANGED,
      entityType: "lead",
      entityId: id,
      leadId: id,
      metadata: { from: previousStatus, to: input.status, reference: current.reference },
      ipAddress,
    });

    return updated;
  },

  async assign(
    id: string,
    input: AssignLeadInput,
    actorId: string,
    ipAddress?: string | null,
  ) {
    const current = await leadRepository.findById(id);
    if (!current) throw new Error("Lead not found");

    const previousAssigneeId = current.assignedToId;
    if (previousAssigneeId === input.assignedToId) return current;

    const updated = await leadRepository.assign(id, input.assignedToId);

    if (actorId) {
      const assignee = input.assignedToId
        ? await userRepository.findById(input.assignedToId)
        : null;
      await leadRepository.addNote({
        leadId: id,
        authorId: actorId,
        body: input.note ||
          (assignee
            ? `Lead assigned to ${assignee.name}.`
            : `Lead unassigned.`),
        kind: "assignment",
      });
    }

    emitLeadEvent(LEAD_EVENT_NAMES.ASSIGNED, {
      leadId: id,
      reference: current.reference,
      actorId,
      ipAddress,
      metadata: { from: previousAssigneeId, to: input.assignedToId },
    });

    await activityRepository.log({
      userId: actorId,
      action: LEAD_EVENT_NAMES.ASSIGNED,
      entityType: "lead",
      entityId: id,
      leadId: id,
      metadata: {
        from: previousAssigneeId,
        to: input.assignedToId,
        reference: current.reference,
      },
      ipAddress,
    });

    return updated;
  },

  async addNote(
    id: string,
    input: AddLeadNoteInput,
    actorId: string,
    ipAddress?: string | null,
  ) {
    const current = await leadRepository.findById(id);
    if (!current) throw new Error("Lead not found");

    const note = await leadRepository.addNote({
      leadId: id,
      authorId: actorId,
      body: input.body,
      kind: input.kind,
    });

    if (input.kind === "quote_sent") {
      emitLeadEvent(LEAD_EVENT_NAMES.QUOTE_SENT, {
        leadId: id,
        reference: current.reference,
        actorId,
        ipAddress,
      });
    }

    emitLeadEvent(LEAD_EVENT_NAMES.NOTE_ADDED, {
      leadId: id,
      reference: current.reference,
      actorId,
      ipAddress,
      metadata: { kind: input.kind },
    });

    await activityRepository.log({
      userId: actorId,
      action: LEAD_EVENT_NAMES.NOTE_ADDED,
      entityType: "lead",
      entityId: id,
      leadId: id,
      metadata: { kind: input.kind, reference: current.reference },
      ipAddress,
    });

    return note;
  },

  async stats() {
    const [byStatus, byDay, recent, total] = await Promise.all([
      leadRepository.countByStatus(),
      leadRepository.countByDay(30),
      leadRepository.recent(6),
      db.lead.count(),
    ]);
    return { byStatus, byDay, recent, total };
  },
};
