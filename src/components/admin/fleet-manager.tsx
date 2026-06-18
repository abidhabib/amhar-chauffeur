"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Users, Briefcase, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api-client";
import { CATEGORY_META, VEHICLE_CATEGORIES, type VehicleCategory } from "@/lib/dto/lead.dto";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface FleetItem {
  id: string;
  name: string;
  slug: string;
  category: VehicleCategory;
  brand: string;
  seats: number;
  luggage: number;
  description: string | null;
  imageUrl: string | null;
  features: string[];
  displayOrder: number;
  isVisible: boolean;
}

export function AdminFleet() {
  const [items, setItems] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FleetItem | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await api.listFleet(true);
      setItems(items);
    } catch (e) {
      toast.error("Failed to load fleet");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleVisibility = async (item: FleetItem) => {
    try {
      const updated = await api.updateFleet(item.id, { isVisible: !item.isVisible });
      setItems((l) => l.map((x) => (x.id === item.id ? updated : x)));
      toast.success(updated.isVisible ? "Vehicle shown" : "Vehicle hidden");
    } catch (e) {
      toast.error("Failed to toggle");
    }
  };

  const remove = async (item: FleetItem) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await api.deleteFleet(item.id);
      setItems((l) => l.filter((x) => x.id !== item.id));
      toast.success("Vehicle deleted");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-light text-foreground tracking-tight">Fleet</h1>
          <p className="text-[13px] text-foreground/50 mt-1">
            {items.length} vehicles · {items.filter((i) => i.isVisible).length} visible to clients
          </p>
        </div>
        <LuxuryButton size="md" variant="solid-gold" onClick={() => setCreating(true)}>
          <Plus size={13} strokeWidth={2} /> Add Vehicle
        </LuxuryButton>
      </div>

      {loading ? (
        <div className="text-center py-16 text-foreground/40 text-sm">Loading fleet…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-foreground/40 text-sm">No vehicles yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-5 rounded-sm border bg-card transition-all duration-300",
                item.isVisible
                  ? "border-foreground/[0.08] hover:border-foreground/[0.18]"
                  : "border-foreground/[0.04] opacity-60",
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-1">
                    {item.brand}
                  </p>
                  <h3 className="text-[15px] font-medium text-foreground">{item.name}</h3>
                </div>
                <span className="text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 rounded-sm bg-foreground/[0.06] text-foreground/60">
                  {CATEGORY_META[item.category].label}
                </span>
              </div>

              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-sm mb-3"
                />
              )}

              <div className="flex items-center gap-4 text-[12px] text-foreground/60 mb-4">
                <span className="flex items-center gap-1.5">
                  <Users size={12} /> {item.seats}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase size={12} /> {item.luggage}
                </span>
                <span className="text-foreground/40">order #{item.displayOrder}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(item)}
                  className="flex-1 h-8 flex items-center justify-center gap-1.5 border border-foreground/10 rounded-sm text-[11px] tracking-[0.14em] uppercase text-foreground/70 hover:border-foreground/30 transition-colors"
                >
                  <Pencil size={11} /> Edit
                </button>
                <button
                  onClick={() => toggleVisibility(item)}
                  className="w-8 h-8 flex items-center justify-center border border-foreground/10 rounded-sm text-foreground/70 hover:border-foreground/30 transition-colors"
                  title={item.isVisible ? "Hide" : "Show"}
                >
                  {item.isVisible ? <Eye size={11} /> : <EyeOff size={11} />}
                </button>
                <button
                  onClick={() => remove(item)}
                  className="w-8 h-8 flex items-center justify-center border border-red-500/20 rounded-sm text-red-400/70 hover:border-red-500/50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <FleetForm
          item={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); load(); }}
        />
      )}
    </div>
  );
}

// =====================================================================
// Fleet create/edit form
// =====================================================================
function FleetForm({
  item, onClose, onSaved,
}: { item: FleetItem | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    slug: item?.slug ?? "",
    category: item?.category ?? ("sedan" as VehicleCategory),
    brand: item?.brand ?? "",
    seats: item?.seats ?? 3,
    luggage: item?.luggage ?? 2,
    description: item?.description ?? "",
    imageUrl: item?.imageUrl ?? "",
    features: (item?.features ?? []).join(", "),
    displayOrder: item?.displayOrder ?? 0,
    isVisible: item?.isVisible ?? true,
  });
  const [saving, setSaving] = useState(false);

  const update = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        category: form.category,
        brand: form.brand,
        seats: Number(form.seats),
        luggage: Number(form.luggage),
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
        displayOrder: Number(form.displayOrder),
        isVisible: form.isVisible,
      };
      if (item) {
        await api.updateFleet(item.id, payload);
        toast.success("Vehicle updated");
      } else {
        await api.createFleet(payload);
        toast.success("Vehicle added");
      }
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[560px] p-0 bg-background border-foreground/[0.08] rounded-sm">
        <VisuallyHidden>
          <DialogTitle>{item ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
          <DialogDescription>Create or update a fleet entry.</DialogDescription>
        </VisuallyHidden>

        <div className="px-7 py-5 border-b border-foreground/[0.06] flex items-center justify-between">
          <h2 className="text-[16px] font-medium text-foreground">
            {item ? "Edit vehicle" : "Add a vehicle"}
          </h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        <div className="px-7 py-6 space-y-4 max-h-[70svh] overflow-y-auto">
          <FormRow label="Name">
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Rolls Royce Phantom"
              className="amhar-input"
            />
          </FormRow>

          <FormRow label="Brand">
            <input
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              placeholder="Rolls Royce"
              className="amhar-input"
            />
          </FormRow>

          <FormRow label="Slug (URL)">
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="rolls-royce-phantom"
              className="amhar-input"
            />
          </FormRow>

          <FormRow label="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="amhar-input"
            >
              {VEHICLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_META[c].label}</option>
              ))}
            </select>
          </FormRow>

          <div className="grid grid-cols-3 gap-3">
            <FormRow label="Seats">
              <input
                type="number"
                value={form.seats}
                onChange={(e) => update("seats", e.target.value)}
                className="amhar-input"
              />
            </FormRow>
            <FormRow label="Luggage">
              <input
                type="number"
                value={form.luggage}
                onChange={(e) => update("luggage", e.target.value)}
                className="amhar-input"
              />
            </FormRow>
            <FormRow label="Order">
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => update("displayOrder", e.target.value)}
                className="amhar-input"
              />
            </FormRow>
          </div>

          <FormRow label="Image URL">
            <input
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://…"
              className="amhar-input"
            />
          </FormRow>

          <FormRow label="Features (comma-separated)">
            <input
              value={form.features}
              onChange={(e) => update("features", e.target.value)}
              placeholder="Wi-Fi, Mineral water, Privacy partition"
              className="amhar-input"
            />
          </FormRow>

          <FormRow label="Description">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-transparent border border-foreground/10 rounded-sm text-[13px] text-foreground focus:outline-none focus:border-[#c9a961] transition-colors resize-none"
            />
          </FormRow>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(e) => update("isVisible", e.target.checked)}
              className="w-4 h-4 accent-[#c9a961]"
            />
            <span className="text-[12px] text-foreground/70">Visible to clients on the website</span>
          </label>
        </div>

        <div className="px-7 py-5 border-t border-foreground/[0.06] flex justify-end gap-3">
          <LuxuryButton size="md" variant="ghost" onClick={onClose}>Cancel</LuxuryButton>
          <LuxuryButton size="md" variant="solid-gold" onClick={save} disabled={saving || !form.name}>
            {saving ? "Saving…" : item ? "Save Changes" : "Add Vehicle"}
          </LuxuryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-eyebrow-muted block mb-2">{label}</label>
      {children}
    </div>
  );
}
