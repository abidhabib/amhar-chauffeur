"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Search, ArrowRight, Timer } from "lucide-react";
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
  /** Default tab to show */
  defaultTab?: BookingTab;
  /** Service context — passed to the booking modal as prefill */
  service?: ServiceSlug;
}

export function BookingWidget({ defaultTab = "one-way", service }: Props) {
  const [tab, setTab] = useState<BookingTab>(defaultTab);
  const [pickup, setPickup] = useState<KsaLocation | null>(null);
  const [dropoff, setDropoff] = useState<KsaLocation | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState<number>(2);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openBooking = useBookingStore((s) => s.openModal);
  const setViewStoreTab = useViewStore((s) => s.setBookingTab);

  // Sync default tab when prop changes (e.g. when user clicks a service)
  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  // Sync tab to global store so other components (e.g. nav dropdown) can read/write
  useEffect(() => {
    setViewStoreTab(tab);
  }, [tab, setViewStoreTab]);

  const today = new Date().toISOString().slice(0, 10);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!pickup) e.pickup = "Please select a pickup location";
    if (tab === "one-way" && !dropoff) e.dropoff = "Please select a destination";
    if (!date) e.date = "Please select a date";
    if (!time) e.time = "Please select a time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    openBooking({
      widgetPrefill: {
        pickup: pickup?.name,
        destination: dropoff?.name,
        pickupDate: date,
        pickupTime: time,
        durationHours: tab === "by-the-hour" ? duration : undefined,
        service,
        bookingTab: tab,
      },
    });
  };

  return (
    <div className="w-full bg-card border border-foreground/[0.10] rounded-md shadow-[0_30px_60px_-30px_rgba(26,22,18,0.25)] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-foreground/[0.10] bg-gradient-to-r from-card to-[#b08842]/[0.04]">
        <TabButton
          active={tab === "one-way"}
          onClick={() => setTab("one-way")}
          label="One way"
        />
        <TabButton
          active={tab === "by-the-hour"}
          onClick={() => setTab("by-the-hour")}
          label="By the hour"
        />
      </div>

      {/* Form body */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === "one-way" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* From */}
                <div>
                  <LocationAutocomplete
                    id="from-one-way"
                    label="From"
                    placeholder="Address, airport, hotel..."
                    value={pickup}
                    onChange={setPickup}
                    excludeId={dropoff?.id}
                    icon="from"
                  />
                  {errors.pickup && <FieldError msg={errors.pickup} />}
                </div>

                {/* To */}
                <div>
                  <LocationAutocomplete
                    id="to-one-way"
                    label="To"
                    placeholder="Address, airport, hotel..."
                    value={dropoff}
                    onChange={setDropoff}
                    excludeId={pickup?.id}
                    icon="to"
                  />
                  {errors.dropoff && <FieldError msg={errors.dropoff} />}
                </div>

                {/* Date */}
                <DateField
                  label="Date"
                  value={date}
                  onChange={setDate}
                  min={today}
                  error={errors.date}
                />

                {/* Time */}
                <TimeField
                  label="Pickup time"
                  value={time}
                  onChange={setTime}
                  error={errors.time}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* From */}
                <div>
                  <LocationAutocomplete
                    id="from-hourly"
                    label="From"
                    placeholder="Address, airport, hotel..."
                    value={pickup}
                    onChange={setPickup}
                    icon="from"
                  />
                  {errors.pickup && <FieldError msg={errors.pickup} />}
                </div>

                {/* Duration */}
                <DurationField
                  label="Duration"
                  value={duration}
                  onChange={setDuration}
                />

                {/* Date */}
                <DateField
                  label="Date"
                  value={date}
                  onChange={setDate}
                  min={today}
                  error={errors.date}
                />

                {/* Time */}
                <TimeField
                  label="Pickup time"
                  value={time}
                  onChange={setTime}
                  error={errors.time}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Helper text + Search button */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[12px] text-foreground/60 flex items-center gap-2">
            <Clock size={12} strokeWidth={1.5} className="text-[#b08842]" />
            {tab === "one-way" ? (
              <>Chauffeur will wait <strong className="text-foreground/80">15 minutes free</strong> of charge.</>
            ) : (
              <>Minimum <strong className="text-foreground/80">2 hours</strong> · billed by the hour.</>
            )}
          </p>
          <LuxuryButton
            size="lg"
            variant="solid-gold"
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            <Search size={15} strokeWidth={2} />
            Search
          </LuxuryButton>
        </div>
      </div>
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
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 sm:flex-none px-8 sm:px-10 py-5 text-[12px] font-semibold tracking-[0.22em] uppercase transition-all duration-300 relative",
        active
          ? "text-foreground bg-card"
          : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.02]",
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="active-tab-underline"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b08842]"
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold tracking-[0.22em] uppercase text-foreground/55 mb-1.5">
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center bg-cream border rounded-sm h-14 px-4 transition-all duration-220",
          error
            ? "border-red-500/50"
            : "border-foreground/[0.15] hover:border-foreground/30 focus-within:border-[#b08842] focus-within:shadow-[0_0_0_3px_rgba(176,136,66,0.10)]",
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground/55 mr-3">
          <Calendar size={18} strokeWidth={1.5} />
        </div>
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[14px] text-foreground focus:outline-none font-medium"
        />
      </div>
      {error && <FieldError msg={error} />}
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold tracking-[0.22em] uppercase text-foreground/55 mb-1.5">
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center bg-cream border rounded-sm h-14 px-4 transition-all duration-220",
          error
            ? "border-red-500/50"
            : "border-foreground/[0.15] hover:border-foreground/30 focus-within:border-[#b08842] focus-within:shadow-[0_0_0_3px_rgba(176,136,66,0.10)]",
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground/55 mr-3">
          <Clock size={18} strokeWidth={1.5} />
        </div>
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[14px] text-foreground focus:outline-none font-medium"
        />
      </div>
      {error && <FieldError msg={error} />}
    </div>
  );
}

function DurationField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold tracking-[0.22em] uppercase text-foreground/55 mb-1.5">
        {label}
      </label>
      <div className="relative flex items-center bg-cream border border-foreground/[0.15] rounded-sm h-14 px-4 hover:border-foreground/30 transition-all duration-220">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground/55 mr-3">
          <Timer size={18} strokeWidth={1.5} />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="flex-1 min-w-0 bg-transparent text-[14px] text-foreground focus:outline-none font-medium cursor-pointer appearance-none pr-6"
        >
          {HOURLY_DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
              {opt.note ? ` (${opt.note})` : ""}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/55">
          <ArrowRight size={14} strokeWidth={1.5} className="rotate-90" />
        </div>
      </div>
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 text-[11px] text-red-600 font-medium flex items-center gap-1">
      <span className="w-1 h-1 rounded-full bg-red-600" />
      {msg}
    </p>
  );
}
