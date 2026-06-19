"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Users, Briefcase, Star, Check,
  Plane, Clock, ShieldCheck, BatteryCharging, Droplet, Sparkles,
  Wifi, Thermometer, Armchair, Divide, Hand, Gem, Calendar,
  User as UserIcon, Phone, Mail, ChevronDown, Tag, MessageCircle,
} from "lucide-react";
import { useViewStore } from "@/stores/view-store";
import { useBookingStore } from "@/stores/booking-store";
import { api } from "@/lib/api-client";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { Reveal } from "@/components/shared/reveal";
import { VEHICLE_CLASS_META, AMENITY_META, type VehicleClass } from "@/lib/dto/fleet.dto";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AMENITY_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Hand, Plane, Clock, ShieldCheck, BatteryCharging, Droplet, Sparkles, Gem,
  Wifi, Thermometer, Armchair, Divide,
};

interface VehicleData {
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
  galleryImages: string[];
  features: string[];
  isFeatured: boolean;
  reviewCount: number;
  averageRating: number;
  reviews?: any[];
}

export function VehicleDetailPage() {
  const slug = useViewStore((s) => s.selectedVehicleSlug);
  const searchParams = useViewStore((s) => s.searchParams);
  const goHome = useViewStore((s) => s.goHome);
  const goToSearchResults = useViewStore((s) => s.goToSearchResults);
  const openBooking = useBookingStore((s) => s.openModal);

  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingFor, setBookingFor] = useState<"myself" | "guest">("myself");
  const [promoCode, setPromoCode] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [flightNumber, setFlightNumber] = useState("");

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      try {
        const data = await api.getFleetBySlug(slug);
        setVehicle(data);
      } catch (e) {
        toast.error("Vehicle not found");
        goHome();
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, goHome]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground/50 text-sm">Loading vehicle…</div>
      </div>
    );
  }

  if (!vehicle) return null;

  const classMeta = VEHICLE_CLASS_META[vehicle.vehicleClass];
  const baseFare = vehicle.baseFare;
  const tax = baseFare * vehicle.taxRate;
  const total = baseFare + tax;
  const formatSar = (n: number) => `${n.toFixed(0)}`;

  const handleContinueBooking = () => {
    const notes = [
      `Vehicle: ${vehicle.name} (${classMeta.label})`,
      flightNumber && `Flight: ${flightNumber}`,
      bookingFor === "guest" && "Booking for a guest",
      promoCode && `Promo code: ${promoCode}`,
      pickupNotes && `Pickup notes: ${pickupNotes}`,
      specialRequests && `Special requests: ${specialRequests}`,
      vehicle.features.length > 0 && `Included amenities: ${vehicle.features.map((f) => AMENITY_META[f as keyof typeof AMENITY_META]?.label || f).join(", ")}`,
    ].filter(Boolean).join("\n");

    openBooking({
      widgetPrefill: {
        pickup: searchParams?.from,
        destination: searchParams?.to,
        pickupDate: searchParams?.date,
        pickupTime: searchParams?.time,
        durationHours: searchParams?.durationHours,
        bookingTab: searchParams?.bookingTab,
      },
    });

    // Note: notes will be passed via the widgetPrefill as part of the lead creation
    // For now, the booking modal will handle the standard prefill
    toast.success(`${vehicle.name} selected — complete your booking details`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header strip */}
      <div className="bg-card border-b border-foreground/[0.10] pt-28 pb-5 sticky top-0 z-30 backdrop-blur-xl bg-card/95">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <button
            onClick={goToSearchResults}
            className="flex items-center gap-2 text-[11px] tracking-[0.20em] uppercase text-foreground/60 hover:text-foreground font-semibold mb-3 transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Back to results
          </button>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-foreground/50 font-semibold mb-1">
                {vehicle.brand}{vehicle.year && ` · ${vehicle.year}`} · {classMeta.label}
              </p>
              <h1 className="text-[24px] sm:text-[28px] font-semibold text-foreground tracking-tight">
                {vehicle.name}
              </h1>
              {vehicle.model && (
                <p className="text-[13px] text-foreground/55 font-normal mt-1">
                  {vehicle.model} or similar
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[9px] tracking-[0.20em] uppercase text-foreground/50 font-semibold">Starting from</p>
              <p className="text-[28px] font-light text-foreground tabular-nums leading-none mt-1">
                <span className="text-[14px] text-foreground/60 align-top">SAR</span> {formatSar(total)}
              </p>
              <p className="text-[10px] text-foreground/50 font-normal mt-1">incl. VAT · all fees</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* LEFT: vehicle info */}
          <div>
            {/* Trip summary card */}
            <Reveal className="mb-8">
              <div className="rounded-md border border-foreground/[0.10] bg-card p-5">
                <p className="text-eyebrow-muted mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  Trip Summary
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <TripField label="Pickup" value={searchParams?.from || "—"} />
                  <TripField label="Dropoff" value={searchParams?.to || (searchParams?.durationHours ? "Hourly" : "—")} />
                  <TripField label="Date" value={searchParams?.date ? new Date(searchParams.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—"} />
                  <TripField label="Time" value={searchParams?.time || "—"} />
                </div>
              </div>
            </Reveal>

            {/* Vehicle image */}
            <Reveal delay={100} className="mb-8">
              <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-foreground/[0.04] border border-foreground/[0.08]">
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[14px] tracking-[0.24em] uppercase text-foreground/40 font-semibold">
                      {vehicle.brand}
                    </span>
                  </div>
                )}
                {vehicle.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#d4b876] to-[#b08842] text-[#1a1612] text-[10px] tracking-[0.18em] uppercase font-bold rounded-sm sheen-gold">
                      <Sparkles size={11} strokeWidth={2.5} />
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Vehicle description */}
            {vehicle.description && (
              <Reveal delay={150} className="mb-8">
                <p className="text-eyebrow mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  About this vehicle
                </p>
                <p className="text-[15px] text-foreground/75 font-normal leading-relaxed">
                  {vehicle.description}
                </p>
              </Reveal>
            )}

            {/* Capacity section */}
            <Reveal delay={200} className="mb-8">
              <p className="text-eyebrow mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-[#b08842]" />
                Capacity
              </p>
              <div className="grid grid-cols-3 gap-3">
                <CapacityCard
                  icon={<Users size={18} strokeWidth={1.5} />}
                  value={vehicle.seats}
                  label="Passengers"
                />
                <CapacityCard
                  icon={<Briefcase size={18} strokeWidth={1.5} />}
                  value={vehicle.luggage}
                  label="Large Luggage"
                />
                <CapacityCard
                  icon={<Briefcase size={18} strokeWidth={1.5} />}
                  value={vehicle.carryOn}
                  label="Carry-On"
                />
              </div>
            </Reveal>

            {/* Included features */}
            {vehicle.features.length > 0 && (
              <Reveal delay={250} className="mb-8">
                <p className="text-eyebrow mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  Included Features
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vehicle.features.map((f) => {
                    const meta = AMENITY_META[f as keyof typeof AMENITY_META];
                    const Icon = meta ? AMENITY_ICONS[meta.icon] : Check;
                    return (
                      <div
                        key={f}
                        className="flex items-center gap-3 p-3 rounded-sm border border-foreground/[0.08] bg-card"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-[#b08842]/[0.08] text-[#b08842] flex items-center justify-center">
                          <Icon size={14} strokeWidth={1.5} />
                        </div>
                        <span className="text-[13px] font-medium text-foreground/80">
                          {meta?.label || f.replace(/_/g, " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            )}

            {/* Reviews section */}
            {vehicle.reviewCount > 0 && (
              <Reveal delay={300} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-eyebrow flex items-center gap-2">
                    <span className="w-6 h-px bg-[#b08842]" />
                    Customer Reviews
                  </p>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="fill-[#b08842] text-[#b08842]" />
                    <span className="text-[14px] font-semibold text-foreground">{vehicle.averageRating.toFixed(1)}</span>
                    <span className="text-[12px] text-foreground/55">({vehicle.reviewCount} reviews)</span>
                  </div>
                </div>
                <ReviewsList fleetId={vehicle.id} />
              </Reveal>
            )}

            {/* Notes */}
            <Reveal delay={350} className="mb-8">
              <div className="rounded-md border border-[#b08842]/25 bg-[#b08842]/[0.04] p-5">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#b08842] font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle size={12} strokeWidth={2} />
                  Good to know
                </p>
                <ul className="space-y-2 text-[12.5px] text-foreground/75 font-normal leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#b08842] mt-0.5">·</span>
                    Your chauffeur&apos;s contact details will be sent via WhatsApp 30 minutes before pickup.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#b08842] mt-0.5">·</span>
                    All chauffeurs are background-checked, English & Arabic speaking, and trained in VIP protocol.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#b08842] mt-0.5">·</span>
                    Free cancellation up to 24 hours before pickup. Free waiting time: 60 min (airport) / 15 min (city).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#b08842] mt-0.5">·</span>
                    Vehicle may be substituted with a similar class vehicle if needed. You will be notified in advance.
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: booking sidebar (sticky) */}
          <div>
            <div className="sticky top-44 space-y-5">
              {/* Price breakdown */}
              <div className="rounded-md border border-foreground/[0.10] bg-card p-5 shadow-[0_15px_40px_-25px_rgba(26,22,18,0.2)]">
                <p className="text-eyebrow-muted mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  Price Breakdown
                </p>
                <div className="space-y-2.5">
                  <PriceRow label="Base fare" value={`SAR ${formatSar(baseFare)}`} />
                  <PriceRow label={`VAT (${(vehicle.taxRate * 100).toFixed(0)}%)`} value={`SAR ${formatSar(tax)}`} />
                  <PriceRow label="Free waiting time" value="Included" muted />
                  <PriceRow label="Meet & greet" value="Included" muted />
                  <PriceRow label="Bottled water" value="Included" muted />
                  <div className="pt-2.5 border-t border-foreground/[0.08]" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[12px] tracking-[0.18em] uppercase text-foreground font-semibold">Total</span>
                    <span className="text-[24px] font-light text-foreground tabular-nums">
                      <span className="text-[12px] text-foreground/60 align-top">SAR</span> {formatSar(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flight number (optional) */}
              <div className="rounded-md border border-foreground/[0.10] bg-card p-5">
                <label className="text-eyebrow-muted block mb-2 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  Flight Number (optional)
                </label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="e.g. SV 1234"
                  className="amhar-input"
                />
                <p className="text-[10.5px] text-foreground/55 mt-1.5 font-normal">
                  For airport pickups — we&apos;ll track your flight in real time.
                </p>
              </div>

              {/* Booking options */}
              <div className="rounded-md border border-foreground/[0.10] bg-card p-5">
                <p className="text-eyebrow-muted mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  Booking For
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <BookingForButton
                    active={bookingFor === "myself"}
                    onClick={() => setBookingFor("myself")}
                    label="Myself"
                  />
                  <BookingForButton
                    active={bookingFor === "guest"}
                    onClick={() => setBookingFor("guest")}
                    label="A Guest"
                  />
                </div>
              </div>

              {/* Promo code */}
              <div className="rounded-md border border-foreground/[0.10] bg-card p-5">
                <label className="text-eyebrow-muted block mb-2 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/45" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="amhar-input pl-9"
                    />
                  </div>
                  <button className="px-4 h-12 border border-foreground/15 rounded-sm text-[11px] tracking-[0.14em] uppercase text-foreground/70 hover:border-foreground/30 hover:text-foreground font-semibold transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Pickup notes */}
              <div className="rounded-md border border-foreground/[0.10] bg-card p-5">
                <label className="text-eyebrow-muted block mb-2 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  Pickup Notes (optional)
                </label>
                <textarea
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="e.g. call on arrival, gate number, terminal details"
                  rows={2}
                  className="w-full px-4 py-3 bg-cream border border-foreground/[0.12] rounded-sm text-[13px] font-normal text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-[#b08842] focus:shadow-[0_0_0_3px_rgba(176,136,66,0.10)] transition-all duration-220 resize-none"
                />
              </div>

              {/* Special requests */}
              <div className="rounded-md border border-foreground/[0.10] bg-card p-5">
                <label className="text-eyebrow-muted block mb-2 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#b08842]" />
                  Special Requests (optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. child seat required, multiple stops, VIP protocol"
                  rows={2}
                  className="w-full px-4 py-3 bg-cream border border-foreground/[0.12] rounded-sm text-[13px] font-normal text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-[#b08842] focus:shadow-[0_0_0_3px_rgba(176,136,66,0.10)] transition-all duration-220 resize-none"
                />
              </div>

              {/* Continue booking button */}
              <div className="sticky bottom-4 z-10">
                <LuxuryButton
                  size="lg"
                  variant="solid-gold"
                  magnetic
                  onClick={handleContinueBooking}
                  className="w-full"
                >
                  Continue Booking
                  <ArrowRight size={15} strokeWidth={2} />
                </LuxuryButton>
                <p className="text-center text-[10.5px] text-foreground/55 font-normal mt-2">
                  No payment required · Free cancellation up to 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Sub-components
// =====================================================
function TripField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.20em] uppercase text-foreground/45 font-semibold mb-0.5">
        {label}
      </p>
      <p className="text-[13px] font-medium text-foreground truncate">{value}</p>
    </div>
  );
}

function CapacityCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-sm border border-foreground/[0.08] bg-card p-4 text-center">
      <div className="w-10 h-10 mx-auto rounded-sm bg-[#b08842]/[0.08] text-[#b08842] flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-[20px] font-semibold text-foreground tabular-nums leading-none">
        {value}
      </div>
      <div className="text-[10px] tracking-[0.16em] uppercase text-foreground/55 font-semibold mt-1.5">
        {label}
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-[13px] font-normal", muted ? "text-foreground/55" : "text-foreground/75")}>
        {label}
      </span>
      <span className={cn("text-[13px] tabular-nums", muted ? "text-foreground/55 font-normal" : "text-foreground font-medium")}>
        {value}
      </span>
    </div>
  );
}

function BookingForButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-11 rounded-sm border text-[12px] font-medium tracking-wide transition-all duration-200",
        active
          ? "border-[#b08842] bg-[#b08842]/[0.08] text-[#b08842]"
          : "border-foreground/15 text-foreground/65 hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

// =====================================================
// Reviews list — fetches reviews for this vehicle
// =====================================================
function ReviewsList({ fleetId }: { fleetId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getFleetReviews(fleetId);
        setReviews(res.items || []);
        setStats(res.stats);
      } catch (e) {
        // Silent fail
      } finally {
        setLoading(false);
      }
    })();
  }, [fleetId]);

  if (loading) {
    return <div className="text-[12px] text-foreground/40 py-4">Loading reviews…</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-[12px] text-foreground/40 py-4">No reviews yet.</div>;
  }

  return (
    <div>
      {/* Rating breakdown */}
      {stats && stats.breakdown && (
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 mb-6 p-5 rounded-md border border-foreground/[0.08] bg-card">
          <div className="text-center sm:text-left">
            <div className="text-[42px] font-light text-foreground leading-none tabular-nums">
              {stats.average.toFixed(1)}
            </div>
            <div className="flex items-center gap-0.5 justify-center sm:justify-start mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(stats.average) ? "fill-[#b08842] text-[#b08842]" : "text-foreground/20"}
                />
              ))}
            </div>
            <p className="text-[11px] text-foreground/55 mt-1.5 font-normal">
              Based on {stats.count} verified reviews
            </p>
          </div>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.breakdown[star] || 0;
              const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-[11.5px]">
                  <span className="w-3 text-foreground/65 font-medium">{star}</span>
                  <Star size={10} className="fill-[#b08842] text-[#b08842]" />
                  <div className="flex-1 h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-[#b08842] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-foreground/55 tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.slice(0, visible).map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-md border border-foreground/[0.08] bg-card"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-foreground">{r.customerName}</span>
                  {r.isVerified && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 text-[9px] tracking-[0.14em] uppercase font-semibold">
                      <Check size={9} strokeWidth={3} />
                      Verified
                    </span>
                  )}
                </div>
                {r.country && (
                  <p className="text-[11px] text-foreground/55 mt-0.5">{r.country}</p>
                )}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < r.rating ? "fill-[#b08842] text-[#b08842]" : "text-foreground/20"}
                  />
                ))}
              </div>
            </div>
            {r.title && (
              <p className="text-[13px] font-semibold text-foreground mb-1.5">{r.title}</p>
            )}
            <p className="text-[12.5px] text-foreground/70 font-normal leading-relaxed">{r.body}</p>
            <p className="text-[10.5px] text-foreground/45 mt-2.5">
              {new Date(r.reviewDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>

      {reviews.length > visible && (
        <button
          onClick={() => setVisible(visible + 5)}
          className="mt-4 mx-auto block text-[11px] tracking-[0.16em] uppercase text-[#b08842] hover:text-[#8a6d3b] font-semibold transition-colors"
        >
          Show {reviews.length - visible} more reviews
        </button>
      )}
    </div>
  );
}
