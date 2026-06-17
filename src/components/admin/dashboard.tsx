"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Star, Car, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api-client";
import { STATUS_META, type LeadStatus } from "@/lib/dto/lead.dto";
import { cn } from "@/lib/utils";

interface Stats {
  leads: {
    total: number;
    byStatus: Array<{ status: LeadStatus; count: number }>;
    byDay: Array<{ day: string; count: number }>;
    recent: any[];
  };
  reviews: { average: number; count: number };
  fleetCount: number;
  recentActivity: any[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return <div className="text-foreground/40 text-sm">Loading dashboard…</div>;
  }

  const newCount = stats.leads.byStatus.find((s) => s.status === "new")?.count ?? 0;
  const confirmedCount = stats.leads.byStatus.find((s) => s.status === "confirmed")?.count ?? 0;

  // Max for chart scale
  const maxDay = Math.max(1, ...stats.leads.byDay.map((d) => d.count));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-light text-foreground tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-foreground/50 mt-1">
          A snapshot of lead activity, fleet status, and client sentiment.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Leads"
          value={stats.leads.total}
          icon={<FileText size={15} strokeWidth={1.5} />}
          tone="neutral"
        />
        <KpiCard
          label="New / Uncontacted"
          value={newCount}
          icon={<TrendingUp size={15} strokeWidth={1.5} />}
          tone="gold"
        />
        <KpiCard
          label="Confirmed"
          value={confirmedCount}
          icon={<ArrowUpRight size={15} strokeWidth={1.5} />}
          tone="green"
        />
        <KpiCard
          label="Avg Rating"
          value={`${stats.reviews.average.toFixed(1)} ★`}
          sub={`${stats.reviews.count} reviews`}
          icon={<Star size={15} strokeWidth={1.5} />}
          tone="neutral"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lead volume chart */}
        <div className="lg:col-span-2 p-6 rounded-sm border border-foreground/[0.06] bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[14px] font-medium text-foreground">Lead volume</h2>
              <p className="text-[11px] text-foreground/45 mt-0.5">Last 30 days</p>
            </div>
          </div>
          <div className="h-44 flex items-end gap-[2px]">
            {stats.leads.byDay.length === 0 ? (
              <div className="w-full text-center text-[12px] text-foreground/40 py-12">
                No leads in the last 30 days.
              </div>
            ) : (
              stats.leads.byDay.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 bg-gradient-to-t from-[#c9a961]/30 to-[#c9a961]/80 hover:from-[#c9a961]/50 hover:to-[#c9a961] transition-colors duration-300 rounded-[1px]"
                  style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count > 0 ? "2px" : "0" }}
                  title={`${d.day}: ${d.count} lead${d.count === 1 ? "" : "s"}`}
                />
              ))
            )}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="p-6 rounded-sm border border-foreground/[0.06] bg-card">
          <h2 className="text-[14px] font-medium text-foreground mb-6">By status</h2>
          <div className="space-y-4">
            {stats.leads.byStatus.map((s) => {
              const meta = STATUS_META[s.status];
              const pct = stats.leads.total > 0 ? (s.count / stats.leads.total) * 100 : 0;
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-foreground/70">{meta.label}</span>
                    <span className="text-[12px] text-foreground font-medium">{s.count}</span>
                  </div>
                  <div className="h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "h-full rounded-full",
                        meta.tone === "gold" && "bg-[#c9a961]",
                        meta.tone === "info" && "bg-foreground/60",
                        meta.tone === "neutral" && "bg-foreground/40",
                        meta.tone === "green" && "bg-emerald-500/70",
                        meta.tone === "red" && "bg-red-500/60",
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent leads + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent leads */}
        <div className="lg:col-span-2 p-6 rounded-sm border border-foreground/[0.06] bg-card">
          <h2 className="text-[14px] font-medium text-foreground mb-5">Recent leads</h2>
          <div className="divide-y divide-foreground/[0.05]">
            {stats.leads.recent.length === 0 ? (
              <p className="text-[12px] text-foreground/40 py-8 text-center">No leads yet.</p>
            ) : (
              stats.leads.recent.map((lead: any) => (
                <div key={lead.id} className="py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12px] text-foreground/45 font-mono">
                        {lead.reference}
                      </span>
                      <StatusBadge status={lead.status as LeadStatus} />
                    </div>
                    <div className="text-[13px] text-foreground truncate">
                      {lead.fullName} · {lead.pickup} → {lead.destination}
                    </div>
                  </div>
                  <div className="text-[11px] text-foreground/45 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="p-6 rounded-sm border border-foreground/[0.06] bg-card">
          <h2 className="text-[14px] font-medium text-foreground mb-5">Recent activity</h2>
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {stats.recentActivity.length === 0 ? (
              <p className="text-[12px] text-foreground/40 py-4 text-center">No activity yet.</p>
            ) : (
              stats.recentActivity.map((a: any) => (
                <div key={a.id} className="flex gap-3">
                  <div className="w-1 self-stretch rounded-full bg-[#c9a961]/40" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-foreground/80">
                      <span className="text-foreground font-medium">
                        {a.user?.name ?? "System"}
                      </span>{" "}
                      <span className="text-foreground/55">{formatAction(a.action)}</span>
                    </p>
                    <p className="text-[10px] text-foreground/40 mt-0.5">
                      {new Date(a.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  tone: "neutral" | "gold" | "green";
}) {
  return (
    <div className="p-5 rounded-sm border border-foreground/[0.06] bg-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-[0.18em] uppercase text-foreground/45">{label}</span>
        <span
          className={cn(
            tone === "gold" && "text-[#c9a961]",
            tone === "green" && "text-emerald-500/70",
            tone === "neutral" && "text-foreground/55",
          )}
        >
          {icon}
        </span>
      </div>
      <div className="text-[26px] font-light text-foreground">{value}</div>
      {sub && <div className="text-[11px] text-foreground/45 mt-1">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-sm text-[9px] tracking-[0.16em] uppercase font-medium",
        meta.tone === "gold" && "bg-[#c9a961]/15 text-[#c9a961]",
        meta.tone === "info" && "bg-foreground/10 text-foreground/70",
        meta.tone === "neutral" && "bg-foreground/8 text-foreground/60",
        meta.tone === "green" && "bg-emerald-500/15 text-emerald-400",
        meta.tone === "red" && "bg-red-500/15 text-red-400",
      )}
    >
      {meta.label}
    </span>
  );
}

function formatAction(action: string): string {
  return action
    .split(/[._]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
