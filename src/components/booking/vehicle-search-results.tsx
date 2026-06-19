"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Users, Briefcase, Star, Clock,
  Sparkles, Check, ChevronDown,
} from "lucide-react";
import { useViewStore, type SearchParams } from "@/stores/view-store";
import { useBookingStore } from "@/stores/booking-store";
import { api } from "@/lib/api-client";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { Reveal } from "@/components/shared/reveal";
import { VEHICLE_CLASS_META, type VehicleClass } from "@/lib/dto/fleet.dto";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FleetSearchResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  vehicleClass: VehicleClass;
  brand: string;
  model: string | null;
  year: number | null;
  seats: number;
  luggage: number;
  carryOn: number;
  baseFare: number;
  taxRate: number;
  description: string | null;
  imageUrl: string | null;
  features: string[];
  isFeatured: boolean;
  reviewCount: number;
  averageRating: number;
}

export function VehicleSearchResults() {
  const searchParams = useViewStore((s) => s.searchParams);
  const goHome = useViewStore((s) => s.goHome);
  const goToVehicleDetail = useViewStore((s) => s.goToVehicleDetail);
  const openBooking = useBookingStore((s) => s.openModal);

  const [results, setResults] = useState<FleetSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"recommended" | "price_asc" | "price_desc">("recommended");
  const [filterClass, setFilterClass] = useState<VehicleClass | "all">("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { items } = await api.searchFleet({
          available: true,
          sort: sortBy,
        });
        setResults(items);
      } catch (e) {
        toast.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    })();
  }, [sortBy]);

  const filtered = filterClass === "all"
    ? results
    : results.filter((r) => r.vehicleClass === filterClass);

  const formatPrice = (fare: number, taxRate: number) => {
    const tax = fare * taxRate;
    const total = fare + tax;
    return {
      base: fare.toFixed(0),
      tax: tax.toFixed(0),
      total: total.toFixed(0),
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header strip with search summary */}
      <div className="bg-card border-b border-foreground/[0.10] pt-28 pb-6 sticky top-0 z-30 backdrop-blur-xl bg-card/95">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-[11px] tracking-[0.20em] uppercase text-foreground/60 hover:text-foreground font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Back to home
          </button>

          {/* Search summary */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-[9px] tracking-[0.20em] uppercase text-foreground/45 font-semibold mb-0.5">From</p>
                <p className="text-[14px] font-semibold text-foreground">{searchParams?.from || "Any location"}</p>
              </div>
              <ArrowRight size={14} strokeWidth={1.5} className="text-[#b08842] mx-1" />
              <div>
                <p className="text-[9px] tracking-[0.20em] uppercase text-foreground/45 font-semibold mb-0.5">To</p>
                <p className="text-[14px] font-semibold text-foreground">{searchParams?.to || (searchParams?.durationHours ? "Hourly hire" : "Any destination")}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-foreground/[0.10]" />

            <div>
              <p className="text-[9px] tracking-[0.20em] uppercase text-foreground/45 font-semibold mb-0.5">Date</p>
              <p className="text-[14px] font-medium text-foreground">
                {searchParams?.date
                  ? new Date(searchParams.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                  : "Flexible"}
              </p>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.20em] uppercase text-foreground/45 font-semibold mb-0.5">Time</p>
              <p className="text-[14px] font-medium text-foreground">{searchParams?.time || "—"}</p>
            </div>

            {searchParams?.durationHours && (
              <div>
                <p className="text-[9px] tracking-[0.20em] uppercase text-foreground/45 font-semibold mb-0.5">Duration</p>
                <p className="text-[14px] font-medium text-foreground">{searchParams.durationHours} hours</p>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <label className="text-[10px] tracking-[0.18em] uppercase text-foreground/55 font-semibold">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 px-3 bg-cream border border-foreground/[0.15] rounded-sm text-[12px] font-medium text-foreground focus:outline-none focus:border-[#b08842] cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Body: filters + results */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Filters sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-44">
              <p className="text-eyebrow-muted mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-[#b08842]" />
                Filters
              </p>

              <div className="space-y-1.5">
                <FilterButton
                  active={filterClass === "all"}
                  onClick={() => setFilterClass("all")}
                  label="All Classes"
                  count={results.length}
                />
                {(Object.keys(VEHICLE_CLASS_META) as VehicleClass[]).map((cls) => {
                  const count = results.filter((r) => r.vehicleClass === cls).length;
                  if (count === 0) return null;
                  return (
                    <FilterButton
                      key={cls}
                      active={filterClass === cls}
                      onClick={() => setFilterClass(cls)}
                      label={VEHICLE_CLASS_META[cls].label}
                      count={count}
                    />
                  );
                })}
              </div>

              <div className="mt-8 p-4 rounded-sm border border-foreground/[0.10] bg-[#b08842]/[0.04]">
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#b08842] font-semibold mb-2">
                  All prices include
                </p>
                <ul className="space-y-1.5 text-[11.5px] text-foreground/70 font-normal">
                  <li className="flex items-center gap-1.5"><Check size={10} className="text-[#b08842]" /> 15% VAT</li>
                  <li className="flex items-center gap-1.5"><Check size={10} className="text-[#b08842]" /> Fuel & tolls</li>
                  <li className="flex items-center gap-1.5"><Check size={10} className="text-[#b08842]" /> Chauffeur fee</li>
                  <li className="flex items-center gap-1.5"><Check size={10} className="text-[#b08842]" /> Free waiting time</li>
                  <li className="flex items-center gap-1.5"><Check size={10} className="text-[#b08842]" /> Bottled water</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Results grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-foreground tracking-tight">
                {loading ? "Searching available vehicles…" : `${filtered.length} ${filtered.length === 1 ? "vehicle" : "vehicles"} available`}
              </h2>
              <p className="text-[12px] text-foreground/55 font-normal">
                🇸🇦 Saudi Arabia · Instant confirmation
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-md border border-foreground/[0.08] bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 rounded-md border border-foreground/[0.10] bg-card">
                <p className="text-[16px] font-semibold text-foreground mb-2">No vehicles match your filters</p>
                <p className="text-[13px] text-foreground/60 mb-6">Try selecting "All Classes" or adjusting your sort.</p>
                <LuxuryButton size="md" variant="outline" onClick={() => setFilterClass("all")}>
                  Show all vehicles
                </LuxuryButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filtered.map((vehicle, i) => {
                  const prices = formatPrice(vehicle.baseFare, vehicle.taxRate);
                  const classMeta = VEHICLE_CLASS_META[vehicle.vehicleClass];
                  return (
                    <Reveal key={vehicle.id} delay={Math.min(i * 60, 360)}>
                      <VehicleResultCard
                        vehicle={vehicle}
                        prices={prices}
                        classLabel={classMeta.label}
                        onSelect={() => goToVehicleDetail(vehicle.slug)}
                        onBook={() =>
                          openBooking({
                            widgetPrefill: {
                              pickup: searchParams?.from,
                              destination: searchParams?.to,
                              pickupDate: searchParams?.date,
                              pickupTime: searchParams?.time,
                              durationHours: searchParams?.durationHours,
                              bookingTab: searchParams?.bookingTab,
                            },
                          })
                        }
                      />
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Vehicle Result Card
// =====================================================
function VehicleResultCard({
  vehicle,
  prices,
  classLabel,
  onSelect,
  onBook,
}: {
  vehicle: FleetSearchResult;
  prices: { base: string; tax: string; total: string };
  classLabel: string;
  onSelect: () => void;
  onBook: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-md border bg-card overflow-hidden transition-all duration-300",
        vehicle.isFeatured
          ? "border-[#b08842]/40 shadow-[0_15px_40px_-20px_rgba(176,136,66,0.3)]"
          : "border-foreground/[0.10] hover:border-foreground/20 hover:shadow-[0_15px_40px_-25px_rgba(26,22,18,0.2)]",
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_200px] gap-0">
        {/* Image */}
        <button
          onClick={onSelect}
          className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden bg-foreground/[0.04] group"
        >
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] tracking-[0.24em] uppercase text-foreground/40 font-semibold">
                {vehicle.brand}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c08]/40 to-transparent" />
          {/* Featured badge */}
          {vehicle.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-br from-[#d4b876] to-[#b08842] text-[#1a1612] text-[9px] tracking-[0.18em] uppercase font-bold rounded-sm sheen-gold">
                <Sparkles size={9} strokeWidth={2.5} />
                Featured
              </span>
            </div>
          )}
          {/* Class badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-0.5 bg-card/95 backdrop-blur-sm text-[9px] tracking-[0.18em] uppercase text-foreground/70 font-semibold rounded-sm">
              {classLabel}
            </span>
          </div>
        </button>

        {/* Info */}
        <div className="p-5 sm:p-6 flex flex-col">
          <button onClick={onSelect} className="text-left group">
            <p className="text-[10px] tracking-[0.22em] uppercase text-foreground/50 mb-1.5 font-semibold">
              {vehicle.brand}{vehicle.year && ` · ${vehicle.year}`}
            </p>
            <h3 className="text-[19px] font-semibold text-foreground mb-1 tracking-tight group-hover:text-[#b08842] transition-colors">
              {vehicle.name}
            </h3>
            {vehicle.model && (
              <p className="text-[12px] text-foreground/55 font-normal mb-3">{vehicle.model}</p>
            )}
          </button>

          {/* Capacity row */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-[12.5px] text-foreground/70 font-medium">
            <span className="flex items-center gap-1.5">
              <Users size={13} strokeWidth={1.5} className="text-foreground/55" />
              {vehicle.seats} passengers
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase size={13} strokeWidth={1.5} className="text-foreground/55" />
              {vehicle.luggage} luggage
            </span>
            {vehicle.reviewCount > 0 && (
              <span className="flex items-center gap-1.5">
                <Star size={12} className="fill-[#b08842] text-[#b08842]" />
                <strong className="text-foreground">{vehicle.averageRating.toFixed(1)}</strong>
                <span className="text-foreground/55">({vehicle.reviewCount})</span>
              </span>
            )}
          </div>

          {/* Description */}
          {vehicle.description && (
            <p className="text-[12.5px] text-foreground/65 font-normal leading-relaxed line-clamp-2 mb-3">
              {vehicle.description}
            </p>
          )}

          {/* Features preview */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {vehicle.features.slice(0, expanded ? 12 : 5).map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 rounded-sm bg-foreground/[0.04] text-[10px] tracking-[0.10em] uppercase text-foreground/60 font-medium"
              >
                {f.replace(/_/g, " ")}
              </span>
            ))}
            {vehicle.features.length > 5 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-2 py-0.5 text-[10px] tracking-[0.10em] uppercase text-[#b08842] hover:text-[#8a6d3b] font-semibold transition-colors"
              >
                {expanded ? "Show less" : `+${vehicle.features.length - 5} more`}
              </button>
            )}
          </div>

          {/* View details link */}
          <button
            onClick={onSelect}
            className="mt-auto pt-3 text-[11px] tracking-[0.18em] uppercase text-foreground/55 hover:text-[#b08842] font-semibold transition-colors flex items-center gap-1.5 self-start"
          >
            View vehicle details
            <ArrowRight size={11} strokeWidth={2} />
          </button>
        </div>

        {/* Price + CTA */}
        <div className="p-5 sm:p-6 border-t md:border-t-0 md:border-l border-foreground/[0.08] bg-[#efe8dc]/30 flex flex-col justify-center items-center text-center">
          <p className="text-[9px] tracking-[0.20em] uppercase text-foreground/50 font-semibold mb-1">Starting from</p>
          <p className="text-[26px] font-light text-foreground tabular-nums leading-none mb-1">
            <span className="text-[14px] text-foreground/60 align-top">SAR</span> {prices.total}
          </p>
          <p className="text-[10px] text-foreground/50 font-normal mb-4">incl. VAT · all fees</p>

          <LuxuryButton
            size="md"
            variant="solid-gold"
            onClick={onBook}
            className="w-full"
          >
            Select
            <ArrowRight size={12} strokeWidth={2} />
          </LuxuryButton>
          <button
            onClick={onSelect}
            className="mt-2 text-[10px] tracking-[0.16em] uppercase text-foreground/50 hover:text-foreground font-semibold transition-colors"
          >
            View details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// =====================================================
// Filter Button
// =====================================================
function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-sm text-[12.5px] font-medium transition-all duration-200",
        active
          ? "bg-foreground/[0.06] text-foreground"
          : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.02]",
      )}
    >
      <span className="flex items-center gap-2">
        {active && <span className="w-1 h-1 rounded-full bg-[#b08842]" />}
        {label}
      </span>
      <span className="text-[11px] text-foreground/45 tabular-nums">{count}</span>
    </button>
  );
}
