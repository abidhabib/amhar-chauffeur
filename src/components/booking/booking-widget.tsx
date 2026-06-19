"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Search, ArrowRight, Timer, Sparkles, MapPin } from "lucide-react";
import { LocationAutocomplete } from "@/components/shared/location-autocomplete";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { useBookingStore } from "@/stores/booking-store";
import { useViewStore } from "@/stores/view-store";
import {
  HOURLY_DURATION_OPTIONS,
  type BookingTab,
  type ServiceSlug,
} from "@/lib/services-catalog";
import type { KsaLocation } from "@/lib/ksa-locations";
import { cn } from "@/lib/utils";

interface Props {
  defaultTab?: BookingTab;
  service?: ServiceSlug;
  /** When true, renders the dark glass variant (for use over dark hero backgrounds) */
  variant?: "light" | "dark";
}

export function BookingWidget({ defaultTab = "one-way", service, variant = "light" }: Props) {
  const [tab, setTab] = useState<BookingTab>(defaultTab);
  const [pickup, setPickup] = useState<KsaLocation | null>(null);
  const [dropoff, setDropoff] = useState<KsaLocation | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState<number>(2);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openBooking = useBookingStore((s) => s.openModal);
  const setViewStoreTab = useViewStore((s) => s.setBookingTab);
  const goToSearchResults = useViewStore((s) => s.goToSearchResults);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    setViewStoreTab(tab);
  }, [tab, setViewStoreTab]);

  const today = new Date().toISOString().slice(0, 10);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!pickup) e.pickup = "Required";
    if (tab === "one-way" && !dropoff) e.dropoff = "Required";
    if (!date) e.date = "Required";
    if (!time) e.time = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    goToSearchResults({
      from: pickup?.name,
      to: dropoff?.name,
      date,
      time,
      durationHours: tab === "by-the-hour" ? duration : undefined,
      bookingTab: tab,
    });
  };

  const isDark = variant === "dark";

  return (
    <div className="relative w-full">
      {/* Premium glassmorphism card */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden transition-all duration-500",
          "backdrop-blur-2xl",
          isDark
            ? "bg-[#1a1612]/60 border border-[#d4b876]/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_0_60px_-20px_rgba(212,184,118,0.15)]"
            : "bg-card/80 border border-foreground/[0.08] shadow-[0_30px_80px_-30px_rgba(26,22,18,0.45),0_8px_24px_-12px_rgba(26,22,18,0.15)]",
        )}
      >
        {/* Decorative gradient glow at top */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(212, 184, 118, 0.4) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full pointer-events-none opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(176, 136, 66, 0.3) 0%, transparent 70%)",
          }}
        />

        {/* Tab bar with refined glass */}
        <div
          className={cn(
            "relative flex items-center border-b backdrop-blur-sm",
            isDark ? "border-[#d4b876]/15" : "border-foreground/[0.06]",
            isDark ? "bg-[#0f0c08]/30" : "bg-gradient-to-r from-card/60 via-card/40 to-[#b08842]/[0.06]",
          )}
        >
          <TabButton
            active={tab === "one-way"}
            onClick={() => setTab("one-way")}
            label="One way"
            isDark={isDark}
          />
          <TabButton
            active={tab === "by-the-hour"}
            onClick={() => setTab("by-the-hour")}
            label="By the hour"
            isDark={isDark}
          />
          {/* Right-side helper pill */}
          <div className="hidden md:flex items-center gap-1.5 ml-auto px-6 text-[10px] tracking-[0.18em] uppercase font-semibold">
            <span className={cn("flex items-center gap-1.5", isDark ? "text-[#d4b876]/70" : "text-foreground/45")}>
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-[#b08842] animate-ping opacity-75" />
                <span className="relative rounded-full w-1.5 h-1.5 bg-[#b08842]" />
              </span>
              Live pricing
            </span>
          </div>
        </div>

        {/* Form body */}
        <div className="relative p-5 sm:p-7 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === "one-way" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <LocationAutocomplete
                      id="from-one-way"
                      label="From"
                      placeholder="Address, airport, hotel..."
                      value={pickup}
                      onChange={setPickup}
                      excludeId={dropoff?.id}
                      icon="from"
                      isDark={isDark}
                    />
                    {errors.pickup && <FieldError msg={errors.pickup} isDark={isDark} />}
                  </div>
                  <div>
                    <LocationAutocomplete
                      id="to-one-way"
                      label="To"
                      placeholder="Address, airport, hotel..."
                      value={dropoff}
                      onChange={setDropoff}
                      excludeId={pickup?.id}
                      icon="to"
                      isDark={isDark}
                    />
                    {errors.dropoff && <FieldError msg={errors.dropoff} isDark={isDark} />}
                  </div>
                  <DateField
                    label="Date"
                    value={date}
                    onChange={setDate}
                    min={today}
                    error={errors.date}
                    isDark={isDark}
                  />
                  <TimeField
                    label="Pickup time"
                    value={time}
                    onChange={setTime}
                    error={errors.time}
                    isDark={isDark}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <LocationAutocomplete
                      id="from-hourly"
                      label="From"
                      placeholder="Address, airport, hotel..."
                      value={pickup}
                      onChange={setPickup}
                      icon="from"
                      isDark={isDark}
                    />
                    {errors.pickup && <FieldError msg={errors.pickup} isDark={isDark} />}
                  </div>
                  <DurationField
                    label="Duration"
                    value={duration}
                    onChange={setDuration}
                    isDark={isDark}
                  />
                  <DateField
                    label="Date"
                    value={date}
                    onChange={setDate}
                    min={today}
                    error={errors.date}
                    isDark={isDark}
                  />
                  <TimeField
                    label="Pickup time"
                    value={time}
                    onChange={setTime}
                    error={errors.time}
                    isDark={isDark}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Helper text + Search button */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-foreground/[0.06]">
            <p className={cn(
              "text-[12px] flex items-center gap-2 font-normal",
              isDark ? "text-[#f6f1e9]/70" : "text-foreground/65",
            )}>
              <Clock size={12} strokeWidth={1.5} className="text-[#b08842]" />
              {tab === "one-way" ? (
                <>Chauffeur will wait <strong className={cn("font-medium", isDark ? "text-[#d4b876]" : "text-foreground/85")}>15 minutes free</strong> of charge.</>
              ) : (
                <>Minimum <strong className={cn("font-medium", isDark ? "text-[#d4b876]" : "text-foreground/85")}>2 hours</strong> · billed by the hour.</>
              )}
            </p>
            <LuxuryButton
              size="lg"
              variant="solid-gold"
              onClick={handleSubmit}
              className="w-full sm:w-auto group"
            >
              <Search size={15} strokeWidth={2} className="transition-transform group-hover:scale-110" />
              Search Available Vehicles
              <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </LuxuryButton>
          </div>
        </div>
      </div>

      {/* Subtle bottom accent line — gives the card a premium "floating" feel */}
      <div
        aria-hidden
        className="absolute -bottom-px left-12 right-12 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(176, 136, 66, 0.4), transparent)",
        }}
      />
    </div>
  );
}

// =====================================================
// Sub-components
// =====================================================

function TabButton({
  active,
  onClick,
  label,
  isDark,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-6 sm:px-10 py-5 text-[12px] font-semibold tracking-[0.22em] uppercase transition-all duration-300",
        active
          ? isDark ? "text-[#d4b876]" : "text-foreground"
          : isDark
            ? "text-[#f6f1e9]/55 hover:text-[#f6f1e9]"
            : "text-foreground/55 hover:text-foreground",
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        {active && (
          <Sparkles size={11} strokeWidth={2} className="text-[#b08842]" />
        )}
        {label}
      </span>
      {active && (
        <motion.span
          layoutId="active-tab-underline"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b08842] to-transparent"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </button>
  );
}

function DateField({
  label,
  value,
  onChange,
  min,
  error,
  isDark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  error?: string;
  isDark: boolean;
}) {
  return (
    <div>
      <label className={cn(
        "block text-[10px] font-semibold tracking-[0.22em] uppercase mb-1.5",
        isDark ? "text-[#f6f1e9]/55" : "text-foreground/55",
      )}>
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center rounded-xl h-14 px-4 transition-all duration-300 backdrop-blur-sm border",
          error
            ? "border-red-400/50"
            : isDark
              ? "bg-[#0f0c08]/40 border-[#d4b876]/15 hover:border-[#d4b876]/40 focus-within:border-[#b08842] focus-within:shadow-[0_0_0_3px_rgba(176,136,66,0.15)]"
              : "bg-cream/80 border-foreground/[0.12] hover:border-foreground/30 focus-within:border-[#b08842] focus-within:shadow-[0_0_0_3px_rgba(176,136,66,0.10)]",
        )}
      >
        <div className={cn(
          "flex-shrink-0 w-8 h-8 flex items-center justify-center mr-3 transition-colors",
          isDark ? "text-[#d4b876]/70" : "text-foreground/55",
        )}>
          <Calendar size={18} strokeWidth={1.5} />
        </div>
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "flex-1 min-w-0 bg-transparent text-[14px] focus:outline-none font-medium",
            isDark ? "text-[#f6f1e9]" : "text-foreground",
          )}
        />
      </div>
      {error && <FieldError msg={error} isDark={isDark} />}
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
  error,
  isDark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  isDark: boolean;
}) {
  return (
    <div>
      <label className={cn(
        "block text-[10px] font-semibold tracking-[0.22em] uppercase mb-1.5",
        isDark ? "text-[#f6f1e9]/55" : "text-foreground/55",
      )}>
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center rounded-xl h-14 px-4 transition-all duration-300 backdrop-blur-sm border",
          error
            ? "border-red-400/50"
            : isDark
              ? "bg-[#0f0c08]/40 border-[#d4b876]/15 hover:border-[#d4b876]/40 focus-within:border-[#b08842] focus-within:shadow-[0_0_0_3px_rgba(176,136,66,0.15)]"
              : "bg-cream/80 border-foreground/[0.12] hover:border-foreground/30 focus-within:border-[#b08842] focus-within:shadow-[0_0_0_3px_rgba(176,136,66,0.10)]",
        )}
      >
        <div className={cn(
          "flex-shrink-0 w-8 h-8 flex items-center justify-center mr-3 transition-colors",
          isDark ? "text-[#d4b876]/70" : "text-foreground/55",
        )}>
          <Clock size={18} strokeWidth={1.5} />
        </div>
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "flex-1 min-w-0 bg-transparent text-[14px] focus:outline-none font-medium",
            isDark ? "text-[#f6f1e9]" : "text-foreground",
          )}
        />
      </div>
      {error && <FieldError msg={error} isDark={isDark} />}
    </div>
  );
}

function DurationField({
  label,
  value,
  onChange,
  isDark,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isDark: boolean;
}) {
  return (
    <div>
      <label className={cn(
        "block text-[10px] font-semibold tracking-[0.22em] uppercase mb-1.5",
        isDark ? "text-[#f6f1e9]/55" : "text-foreground/55",
      )}>
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center rounded-xl h-14 px-4 transition-all duration-300 backdrop-blur-sm border",
          isDark
            ? "bg-[#0f0c08]/40 border-[#d4b876]/15 hover:border-[#d4b876]/40"
            : "bg-cream/80 border-foreground/[0.12] hover:border-foreground/30",
        )}
      >
        <div className={cn(
          "flex-shrink-0 w-8 h-8 flex items-center justify-center mr-3",
          isDark ? "text-[#d4b876]/70" : "text-foreground/55",
        )}>
          <Timer size={18} strokeWidth={1.5} />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className={cn(
            "flex-1 min-w-0 bg-transparent text-[14px] focus:outline-none font-medium cursor-pointer appearance-none pr-6",
            isDark ? "text-[#f6f1e9]" : "text-foreground",
          )}
        >
          {HOURLY_DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
              {opt.note ? ` (${opt.note})` : ""}
            </option>
          ))}
        </select>
        <div className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none",
          isDark ? "text-[#d4b876]/70" : "text-foreground/55",
        )}>
          <ArrowRight size={14} strokeWidth={1.5} className="rotate-90" />
        </div>
      </div>
    </div>
  );
}

function FieldError({ msg, isDark }: { msg: string; isDark: boolean }) {
  return (
    <p className="mt-1.5 text-[11px] text-red-400 font-medium flex items-center gap-1">
      <span className="w-1 h-1 rounded-full bg-red-400" />
      {msg}
    </p>
  );
}
