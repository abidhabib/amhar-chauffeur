"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, Check, X, Quote, Sparkles, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  clientName: string;
  clientTitle: string | null;
  rating: number;
  body: string;
  source: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export function AdminReviews() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await api.listReviews(true);
      setItems(items);
    } catch (e) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  const approve = async (r: Review) => {
    try {
      const updated = await api.updateReview(r.id, { isApproved: !r.isApproved });
      setItems((l) => l.map((x) => (x.id === r.id ? updated : x)));
      toast.success(updated.isApproved ? "Review approved" : "Review unapproved");
    } catch (e) {
      toast.error("Failed to update");
    }
  };

  const feature = async (r: Review) => {
    try {
      const updated = await api.updateReview(r.id, { isFeatured: !r.isFeatured, isApproved: true });
      setItems((l) => l.map((x) => (x.id === r.id ? updated : x)));
      toast.success(updated.isFeatured ? "Marked as featured" : "Removed from featured");
    } catch (e) {
      toast.error("Failed to update");
    }
  };

  const remove = async (r: Review) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.deleteReview(r.id);
      setItems((l) => l.filter((x) => x.id !== r.id));
      toast.success("Review deleted");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-light text-foreground tracking-tight">Reviews</h1>
          <p className="text-[13px] text-foreground/50 mt-1">
            Moderate client testimonials before they appear publicly.
          </p>
        </div>
        <div className="flex gap-1 p-1 bg-foreground/[0.04] rounded-sm">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase rounded-[2px] transition-all",
                filter === f ? "bg-background text-foreground shadow-sm" : "text-foreground/55 hover:text-foreground",
              )}
            >
              {f === "pending" ? `Pending (${items.filter((r) => !r.isApproved).length})` : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-foreground/40 text-sm">Loading reviews…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-foreground/40 text-sm">
          {filter === "pending" ? "No pending reviews." : "No reviews found."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={cn(
                "p-6 rounded-sm border bg-card",
                r.isApproved ? "border-foreground/[0.08]" : "border-[#c9a961]/30 bg-[#c9a961]/[0.02]",
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-[15px] font-medium text-foreground">{r.clientName}</h3>
                    {r.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[9px] tracking-[0.16em] uppercase text-[#c9a961]">
                        <Sparkles size={10} /> Featured
                      </span>
                    )}
                    {r.source === "google" && (
                      <span className="text-[9px] tracking-[0.16em] uppercase px-1.5 py-0.5 rounded-sm bg-foreground/[0.06] text-foreground/55">
                        Google
                      </span>
                    )}
                  </div>
                  {r.clientTitle && (
                    <p className="text-[11px] text-foreground/45">{r.clientTitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < r.rating ? "fill-[#c9a961] text-[#c9a961]" : "text-foreground/20"}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <Quote size={14} className="text-[#c9a961] flex-shrink-0 mt-1" />
                <p className="text-[13px] text-foreground/75 font-light leading-relaxed">
                  {r.body}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-foreground/[0.05]">
                <span className="text-[11px] text-foreground/40">
                  {new Date(r.createdAt).toLocaleString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => feature(r)}
                    className={cn(
                      "px-3 h-8 flex items-center gap-1.5 rounded-sm text-[10px] tracking-[0.14em] uppercase font-medium transition-colors",
                      r.isFeatured
                        ? "bg-[#c9a961]/15 text-[#c9a961]"
                        : "border border-foreground/10 text-foreground/65 hover:border-foreground/30",
                    )}
                  >
                    <Sparkles size={11} /> Featured
                  </button>
                  <button
                    onClick={() => approve(r)}
                    className={cn(
                      "px-3 h-8 flex items-center gap-1.5 rounded-sm text-[10px] tracking-[0.14em] uppercase font-medium transition-colors",
                      r.isApproved
                        ? "border border-foreground/10 text-foreground/65 hover:border-foreground/30"
                        : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25",
                    )}
                  >
                    {r.isApproved ? <><X size={11} /> Unpublish</> : <><Check size={11} /> Approve</>}
                  </button>
                  <button
                    onClick={() => remove(r)}
                    className="w-8 h-8 flex items-center justify-center border border-red-500/20 rounded-sm text-red-400/70 hover:border-red-500/50 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
