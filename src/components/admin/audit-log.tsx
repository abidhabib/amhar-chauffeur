"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

interface ActivityEntry {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
}

const ENTITY_TYPES = ["all", "lead", "fleet", "review", "user"] as const;

export function AdminAuditLog() {
  const [items, setItems] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof ENTITY_TYPES)[number]>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await api.listActivity(200);
      setItems(items);
    } catch (e) {
      toast.error("Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === "all" ? items : items.filter((i) => i.entityType === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-light text-foreground tracking-tight">Audit Log</h1>
          <p className="text-[13px] text-foreground/50 mt-1">
            Immutable record of every meaningful action in the system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-foreground/40" />
          <div className="flex gap-1 p-1 bg-foreground/[0.04] rounded-sm">
            {ENTITY_TYPES.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase rounded-[2px] transition-all",
                  filter === f ? "bg-background text-foreground shadow-sm" : "text-foreground/55 hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-foreground/40 text-sm">Loading audit log…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-foreground/40 text-sm">No entries.</div>
      ) : (
        <div className="rounded-sm border border-foreground/[0.06] bg-card overflow-hidden">
          <div className="divide-y divide-foreground/[0.04]">
            {filtered.map((a) => {
              const meta = a.metadata ? safeParse(a.metadata) : null;
              return (
                <div key={a.id} className="px-5 py-4 grid grid-cols-12 gap-4 items-start hover:bg-foreground/[0.02] transition-colors">
                  {/* Time */}
                  <div className="col-span-2 text-[11px] text-foreground/45 font-mono">
                    {new Date(a.createdAt).toLocaleString("en-GB", {
                      day: "2-digit", month: "short",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>

                  {/* Actor */}
                  <div className="col-span-2">
                    <div className="text-[12px] text-foreground font-medium">
                      {a.user?.name ?? "System"}
                    </div>
                    <div className="text-[10px] text-foreground/40">
                      {a.user?.role.replace("_", " ") ?? "anonymous"}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="col-span-3">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-sm text-[10px] tracking-[0.14em] uppercase font-medium",
                        actionTone(a.action),
                      )}
                    >
                      {formatAction(a.action)}
                    </span>
                  </div>

                  {/* Entity */}
                  <div className="col-span-2 text-[12px] text-foreground/65">
                    <span className="text-foreground/40">{a.entityType}</span>{" "}
                    <span className="font-mono text-[10px]">{a.entityId.slice(-6)}</span>
                  </div>

                  {/* Metadata */}
                  <div className="col-span-3 text-[11px] text-foreground/50 font-light">
                    {meta ? <MetadataView meta={meta} /> : <span className="text-foreground/30">—</span>}
                    {a.ipAddress && (
                      <div className="text-[10px] text-foreground/35 mt-0.5">IP: {a.ipAddress}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function safeParse(s: string): any {
  try { return JSON.parse(s); } catch { return null; }
}

function MetadataView({ meta }: { meta: Record<string, unknown> }) {
  const parts = Object.entries(meta)
    .filter(([k]) => !["reference", "ipAddress"].includes(k))
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${String(v).slice(0, 40)}`);
  return <span>{parts.join(" · ")}</span>;
}

function actionTone(action: string): string {
  if (action.includes("created") || action.includes("approved") || action.includes("activated"))
    return "bg-emerald-500/15 text-emerald-400";
  if (action.includes("deleted") || action.includes("cancelled") || action.includes("deactivated"))
    return "bg-red-500/15 text-red-400";
  if (action.includes("status_changed") || action.includes("role_changed"))
    return "bg-foreground/10 text-foreground/70";
  if (action.includes("assigned") || action.includes("featured"))
    return "bg-[#c9a961]/15 text-[#c9a961]";
  return "bg-foreground/[0.06] text-foreground/55";
}

function formatAction(action: string): string {
  return action
    .split(/[._]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
