/**
 * Lead events — simple event emitter for lead lifecycle events.
 * Subscribers (activity logger, notification dispatcher, etc.) attach listeners.
 *
 * In a real Laravel app this would be Event::class + Listener::class.
 * Here we use Node's EventEmitter to demonstrate the same decoupling.
 */
import { EventEmitter } from "events";

export const leadEvents = new EventEmitter();
leadEvents.setMaxListeners(50);

export type LeadEventPayload = {
  leadId: string;
  reference: string;
  actorId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
};

// Event names — strongly typed via union
export const LEAD_EVENT_NAMES = {
  CREATED: "lead.created",
  STATUS_CHANGED: "lead.status_changed",
  ASSIGNED: "lead.assigned",
  NOTE_ADDED: "lead.note_added",
  QUOTE_SENT: "lead.quote_sent",
} as const;

export type LeadEventName = (typeof LEAD_EVENT_NAMES)[keyof typeof LEAD_EVENT_NAMES];

export function emitLeadEvent(name: LeadEventName, payload: LeadEventPayload) {
  leadEvents.emit(name, payload);
}

export function onLeadEvent(name: LeadEventName, listener: (p: LeadEventPayload) => void) {
  leadEvents.on(name, listener);
  return () => leadEvents.off(name, listener);
}
