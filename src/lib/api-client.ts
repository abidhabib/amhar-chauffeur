/**
 * Tiny typed fetch wrapper used by admin components.
 * Auto-injects the actor header from localStorage (set at admin mount).
 */
import type { VehicleCategory, LeadStatus } from "@/lib/dto/lead.dto";

const ACTOR_ID_KEY = "amhar.actorId";

export function setActorId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTOR_ID_KEY, id);
}

export function getActorId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTOR_ID_KEY);
}

async function request<T>(
  url: string,
  opts: RequestInit = {},
): Promise<T> {
  const headers = new Headers(opts.headers);
  headers.set("Content-Type", "application/json");
  const actorId = getActorId();
  if (actorId) headers.set("x-amhar-actor-id", actorId);

  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      (data && (data.error || (data.details as string))) ||
      `Request failed with ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  // Leads
  listLeads: (params: {
    status?: LeadStatus;
    assignedToId?: string;
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
    });
    return request<{ items: any[]; total: number }>(`/api/leads?${q.toString()}`);
  },
  getLead: (id: string) => request<any>(`/api/leads/${id}`),
  updateLeadStatus: (id: string, status: LeadStatus, note?: string) =>
    request<any>(`/api/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    }),
  assignLead: (id: string, assignedToId: string | null) =>
    request<any>(`/api/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ assignedToId }),
    }),
  addLeadNote: (id: string, body: string, kind = "note") =>
    request<any>(`/api/leads/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ body, kind }),
    }),
  createLead: (input: any) =>
    request<{ reference: string; id: string }>(`/api/leads`, {
      method: "POST",
      body: JSON.stringify(input),
    }),

  // Fleet
  listFleet: (all = false) =>
    request<{ items: any[] }>(`/api/fleet${all ? "?all=1" : ""}`),
  createFleet: (input: any) =>
    request<any>(`/api/fleet`, { method: "POST", body: JSON.stringify(input) }),
  updateFleet: (id: string, input: any) =>
    request<any>(`/api/fleet/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteFleet: (id: string) =>
    request<any>(`/api/fleet/${id}`, { method: "DELETE" }),

  // Reviews
  listReviews: (all = false) =>
    request<{ items: any[]; average?: number; count?: number }>(
      `/api/reviews${all ? "?all=1" : ""}`,
    ),
  updateReview: (id: string, input: any) =>
    request<any>(`/api/reviews/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteReview: (id: string) =>
    request<any>(`/api/reviews/${id}`, { method: "DELETE" }),

  // Users
  listUsers: () => request<{ items: any[] }>(`/api/users`),
  updateUser: (id: string, input: { role?: string; isActive?: boolean }) =>
    request<any>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(input) }),

  // Stats
  getStats: () =>
    request<any>(`/api/stats`),

  // Activity
  listActivity: (limit = 100) =>
    request<{ items: any[] }>(`/api/activity?limit=${limit}`),
};
