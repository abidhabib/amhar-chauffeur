"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Phone, Mail, MessageCircle, User, MapPin, Calendar, Clock,
  Users, Briefcase, Car, FileText, Send, ChevronRight, History,
} from "lucide-react";
import { api } from "@/lib/api-client";
import {
  LEAD_STATUSES, STATUS_META, CATEGORY_META,
  type LeadStatus, type VehicleCategory,
} from "@/lib/dto/lead.dto";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Lead {
  id: string;
  reference: string;
  status: LeadStatus;
  fullName: string;
  email: string | null;
  phone: string;
  countryCode: string;
  pickup: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  vehicleCategory: VehicleCategory;
  vehicleId: string | null;
  passengers: number;
  luggage: number;
  notes: string | null;
  assignedToId: string | null;
  assignedTo?: { id: string; name: string; email: string } | null;
  timeline?: any[];
  createdAt: string;
  updatedAt: string;
}

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { limit: 100, sort: "createdAt_desc" };
      if (statusFilter !== "all") params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const { items, total: t } = await api.listLeads(params);
      setLeads(items);
      setTotal(t);
    } catch (e) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-light text-foreground tracking-tight">Leads</h1>
          <p className="text-[13px] text-foreground/50 mt-1">
            {total} {total === 1 ? "lead" : "leads"} in the system
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, reference, phone, route…"
            className="w-full h-10 pl-10 pr-4 bg-transparent border border-foreground/10 rounded-sm text-[13px] text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#c9a961] transition-colors"
          />
        </div>
        <div className="flex gap-1 p-1 bg-foreground/[0.04] rounded-sm overflow-x-auto">
          {(["all", ...LEAD_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-200 whitespace-nowrap",
                statusFilter === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground/55 hover:text-foreground",
              )}
            >
              {s === "all" ? "All" : STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-foreground/[0.06] bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-foreground/[0.06] bg-foreground/[0.02]">
                <Th>Reference</Th>
                <Th>Client</Th>
                <Th>Route</Th>
                <Th>Pickup</Th>
                <Th>Vehicle</Th>
                <Th>Status</Th>
                <Th>Assigned</Th>
                <Th>Created</Th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-foreground/40">
                    Loading leads…
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-foreground/40">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="cursor-pointer hover:bg-foreground/[0.02] transition-colors group"
                  >
                    <Td>
                      <span className="font-mono text-foreground/55">{lead.reference}</span>
                    </Td>
                    <Td>
                      <div className="text-foreground font-medium">{lead.fullName}</div>
                      <div className="text-[11px] text-foreground/45">{lead.countryCode} {lead.phone}</div>
                    </Td>
                    <Td>
                      <div className="text-foreground/80 max-w-[220px] truncate">
                        {lead.pickup}
                      </div>
                      <div className="text-[11px] text-foreground/45 max-w-[220px] truncate">
                        → {lead.destination}
                      </div>
                    </Td>
                    <Td>
                      <div className="text-foreground/80">
                        {new Date(lead.pickupDate).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short",
                        })}
                      </div>
                      <div className="text-[11px] text-foreground/45">{lead.pickupTime}</div>
                    </Td>
                    <Td>
                      <span className="text-foreground/80">
                        {CATEGORY_META[lead.vehicleCategory].label}
                      </span>
                      <span className="text-[11px] text-foreground/45 ml-1">
                        · {lead.passengers}P
                      </span>
                    </Td>
                    <Td>
                      <StatusBadge status={lead.status} />
                    </Td>
                    <Td>
                      {lead.assignedTo ? (
                        <span className="text-foreground/80">{lead.assignedTo.name}</span>
                      ) : (
                        <span className="text-foreground/35">—</span>
                      )}
                    </Td>
                    <Td>
                      <span className="text-foreground/55">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short",
                        })}
                      </span>
                    </Td>
                    <td className="px-4 py-3">
                      <ChevronRight
                        size={14}
                        strokeWidth={1.5}
                        className="text-foreground/30 group-hover:text-foreground/60 transition-colors"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailDrawer
            leadId={selectedLead.id}
            onClose={() => setSelectedLead(null)}
            onUpdated={(updated) => {
              setLeads((l) => l.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
              setSelectedLead((s) => (s ? { ...s, ...updated } : s));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =====================================================================
// Lead detail drawer
// =====================================================================
function LeadDetailDrawer({
  leadId,
  onClose,
  onUpdated,
}: {
  leadId: string;
  onClose: () => void;
  onUpdated: (lead: any) => void;
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const l = await api.getLead(leadId);
    setLead(l);
    setLoading(false);
  }, [leadId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [l, u] = await Promise.all([
          api.getLead(leadId),
          api.listUsers(),
        ]);
        if (cancelled) return;
        setLead(l);
        setUsers(u.items);
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [leadId]);

  const changeStatus = async (status: LeadStatus) => {
    try {
      const updated = await api.updateLeadStatus(leadId, status);
      onUpdated(updated);
      setLead(updated);
      toast.success(`Status updated to "${STATUS_META[status].label}"`);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  const assign = async (assignedToId: string | null) => {
    try {
      const updated = await api.assignLead(leadId, assignedToId);
      onUpdated(updated);
      setLead(updated);
      toast.success(assignedToId ? "Lead assigned" : "Lead unassigned");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to assign");
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    try {
      await api.addLeadNote(leadId, note.trim());
      setNote("");
      toast.success("Note added");
      reload();
    } catch (e) {
      toast.error("Failed to add note");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[640px] bg-background border-l border-foreground/[0.08] z-50 flex flex-col"
      >
        {/* Header */}
        <div className="px-7 py-5 border-b border-foreground/[0.06] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-mono text-foreground/55">
                {lead?.reference ?? "…"}
              </span>
              {lead && <StatusBadge status={lead.status} />}
            </div>
            <h2 className="text-[18px] font-medium text-foreground mt-1">
              {lead?.fullName ?? "Loading…"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-foreground/50 hover:text-foreground"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {loading || !lead ? (
          <div className="flex-1 flex items-center justify-center text-foreground/40 text-sm">
            Loading lead…
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Quick actions */}
            <div className="px-7 py-5 border-b border-foreground/[0.06] flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${lead.countryCode.replace("+", "")}${lead.phone.replace(/^0+/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-[#c9a961]/15 text-[#c9a961] text-[11px] tracking-[0.14em] uppercase font-medium hover:bg-[#c9a961]/25 transition-colors"
              >
                <MessageCircle size={12} strokeWidth={2} /> WhatsApp
              </a>
              <a
                href={`tel:${lead.countryCode}${lead.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-foreground/15 text-foreground/70 text-[11px] tracking-[0.14em] uppercase font-medium hover:border-foreground/40 transition-colors"
              >
                <Phone size={12} strokeWidth={2} /> Call
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-foreground/15 text-foreground/70 text-[11px] tracking-[0.14em] uppercase font-medium hover:border-foreground/40 transition-colors"
                >
                  <Mail size={12} strokeWidth={2} /> Email
                </a>
              )}
            </div>

            {/* Status workflow */}
            <Section title="Status Workflow" icon={<FileText size={13} />}>
              <div className="grid grid-cols-5 gap-1.5">
                {LEAD_STATUSES.map((s) => {
                  const active = lead.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => changeStatus(s)}
                      className={cn(
                        "px-2 py-2.5 rounded-sm text-[10px] tracking-[0.12em] uppercase font-medium transition-all duration-250",
                        active
                          ? "bg-[#c9a961] text-[#0a0a0b]"
                          : "bg-foreground/[0.04] text-foreground/55 hover:bg-foreground/[0.08] hover:text-foreground",
                      )}
                      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      {STATUS_META[s].label}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Assignment */}
            <Section title="Assigned Operator" icon={<User size={13} />}>
              <select
                value={lead.assignedToId ?? ""}
                onChange={(e) => assign(e.target.value || null)}
                className="amhar-input h-10"
              >
                <option value="">Unassigned</option>
                {users.filter((u) => u.isActive).map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Section>

            {/* Trip details */}
            <Section title="Trip Details" icon={<MapPin size={13} />}>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                <Detail icon={<MapPin size={11} />} label="Pickup" value={lead.pickup} />
                <Detail icon={<MapPin size={11} />} label="Destination" value={lead.destination} />
                <Detail icon={<Calendar size={11} />} label="Date" value={new Date(lead.pickupDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} />
                <Detail icon={<Clock size={11} />} label="Time" value={lead.pickupTime} />
                <Detail icon={<Car size={11} />} label="Vehicle" value={CATEGORY_META[lead.vehicleCategory].label} />
                <Detail icon={<Users size={11} />} label="Passengers" value={String(lead.passengers)} />
                <Detail icon={<Briefcase size={11} />} label="Luggage" value={String(lead.luggage)} />
                <Detail icon={<Mail size={11} />} label="Email" value={lead.email ?? "—"} />
              </dl>
              {lead.notes && (
                <div className="mt-4 pt-4 border-t border-foreground/[0.06]">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-foreground/45 mb-2">Client notes</p>
                  <p className="text-[13px] text-foreground/75 font-light leading-relaxed">{lead.notes}</p>
                </div>
              )}
            </Section>

            {/* Timeline */}
            <Section title="Timeline" icon={<History size={13} />}>
              <div className="space-y-4">
                {lead.timeline && lead.timeline.length > 0 ? (
                  lead.timeline.map((t: any) => (
                    <div key={t.id} className="flex gap-3">
                      <div className="w-1 self-stretch rounded-full bg-[#c9a961]/40" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] text-foreground font-medium">
                            {t.author.name}
                          </span>
                          {t.kind !== "note" && (
                            <span className="px-1.5 py-0.5 bg-foreground/[0.06] rounded-sm text-[9px] tracking-[0.14em] uppercase text-foreground/55">
                              {t.kind.replace("_", " ")}
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] text-foreground/70 font-light">{t.body}</p>
                        <p className="text-[10px] text-foreground/40 mt-1">
                          {new Date(t.createdAt).toLocaleString("en-GB", {
                            day: "2-digit", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-foreground/40 py-2">No timeline entries yet.</p>
                )}
              </div>

              {/* Add note */}
              <div className="mt-5 pt-5 border-t border-foreground/[0.06]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                    placeholder="Add an internal note…"
                    className="flex-1 h-10 px-3 bg-transparent border border-foreground/10 rounded-sm text-[13px] text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-[#c9a961] transition-colors"
                  />
                  <button
                    onClick={addNote}
                    disabled={!note.trim()}
                    className="w-10 h-10 flex items-center justify-center bg-foreground text-background rounded-sm disabled:opacity-30 hover:bg-foreground/90 transition-colors"
                  >
                    <Send size={13} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </Section>

            <div className="h-8" />
          </div>
        )}
      </motion.div>
    </>
  );
}

// =====================================================================
// Shared primitives
// =====================================================================
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-[10px] tracking-[0.16em] uppercase text-foreground/45 font-medium">
      {children}
    </th>
  );
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-top", className)}>{children}</td>;
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-sm text-[9px] tracking-[0.16em] uppercase font-medium",
        meta.tone === "gold" && "bg-[#c9a961]/15 text-[#c9a961]",
        meta.tone === "info" && "bg-foreground/10 text-foreground/70",
        meta.tone === "neutral" && "bg-foreground/[0.08] text-foreground/60",
        meta.tone === "green" && "bg-emerald-500/15 text-emerald-400",
        meta.tone === "red" && "bg-red-500/15 text-red-400",
      )}
    >
      {meta.label}
    </span>
  );
}

function Section({
  title, icon, children,
}: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="px-7 py-5 border-b border-foreground/[0.06]">
      <h3 className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-foreground/45 mb-4">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

function Detail({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-foreground/40 mb-1">
        {icon}
        {label}
      </dt>
      <dd className="text-foreground/85 font-light">{value}</dd>
    </div>
  );
}
