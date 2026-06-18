"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import type { FleetWithFeatures } from "@/lib/dto/fleet.dto";
import { CATEGORY_META, type VehicleCategory } from "@/lib/dto/lead.dto";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { Reveal } from "@/components/shared/reveal";

interface Props {
  fleet: FleetWithFeatures[];
}

const CATEGORY_ORDER: VehicleCategory[] = ["sedan", "suv", "van", "bus"];

export function FleetShowcase({ fleet }: Props) {
  const openBooking = useBookingStore((s) => s.openModal);

  // Sort: by category order, then displayOrder
  const sorted = [...fleet].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category as VehicleCategory);
    const bi = CATEGORY_ORDER.indexOf(b.category as VehicleCategory);
    if (ai !== bi) return ai - bi;
    return a.displayOrder - b.displayOrder;
  });

  // Duplicate the list so the track can scroll infinitely without a visible jump
  const loopItems = [...sorted, ...sorted];

  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const xRef = useRef(0);

  // Measure half-width (one full set) for the seamless loop
  const halfWidthRef = useRef(0);
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        // Total scrollWidth includes both sets — half is one set + gaps
        halfWidthRef.current = trackRef.current.scrollWidth / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    // Re-measure after images load
    const t = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [sorted.length]);

  // Smooth animation loop — advances ~38px/sec, pauses on hover
  useAnimationFrame((_, delta) => {
    if (paused || !trackRef.current || halfWidthRef.current === 0) return;
    // delta is in ms; convert to a per-second speed
    const speed = 38; // px per second — slow, premium
    xRef.current += (speed * delta) / 1000;
    // Seamless reset when we've scrolled exactly one set width
    if (xRef.current >= halfWidthRef.current) {
      xRef.current -= halfWidthRef.current;
    }
    trackRef.current.style.transform = `translate3d(${-xRef.current}px, 0, 0)`;
  });

  return (
    <section
      id="fleet"
      className="py-32 lg:py-44 border-t border-foreground/[0.10] bg-[#efe8dc]/40 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="text-eyebrow mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#b08842]" />
              The Fleet
            </p>
            <h2 className="text-headline text-foreground mb-7">
              Vehicles, chosen with
              <br />
              <span className="text-foreground/40">deliberation.</span>
            </h2>
            <p className="text-body-lg max-w-lg">
              Every car in our fleet earns its place. Curated for comfort,
              maintained to manufacturer specification, and presented immaculately
              for every journey. Hover to pause the showcase.
            </p>
          </div>

          {/* Status pill — auto-scrolling indicator */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-foreground/15 bg-card">
            <span className="relative flex w-2 h-2">
              <span
                className={`absolute inset-0 rounded-full ${paused ? "bg-foreground/40" : "bg-[#b08842]"}`}
              />
              {!paused && (
                <span className="absolute inset-0 rounded-full bg-[#b08842] animate-ping opacity-60" />
              )}
            </span>
            <span className="text-[11px] tracking-[0.20em] uppercase text-foreground/65 font-semibold">
              {paused ? "Paused" : "Auto-scrolling"}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Auto-scrolling track — full-bleed (breaks out of max-w-7xl) */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left edge fade — ivory */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #efe8dc 0%, rgba(239, 232, 220, 0.6) 60%, transparent 100%)",
          }}
        />
        {/* Right edge fade */}
        <div
          aria-hidden
          className="absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(270deg, #efe8dc 0%, rgba(239, 232, 220, 0.6) 60%, transparent 100%)",
          }}
        />

        {/* The track — flex, duplicated content for seamless loop */}
        <div
          ref={trackRef}
          className="flex gap-7 will-change-transform"
          style={{ width: "max-content" }}
        >
          {loopItems.map((v, i) => {
            const cat = v.category as VehicleCategory;
            // Use a stable key combining original id + duplicate index
            const key = `${v.id}-${i}`;
            return (
              <button
                key={key}
                onClick={() =>
                  openBooking({
                    category: cat,
                    vehicleId: v.id,
                    vehicleName: v.name,
                  })
                }
                className="group flex-shrink-0 w-[300px] md:w-[360px] text-left"
                aria-label={`Request ${v.name}`}
              >
                {/* Image card */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-foreground/[0.04] mb-6 border border-foreground/[0.08] group-hover:border-[#b08842]/40 group-hover:shadow-[0_30px_60px_-25px_rgba(26,22,18,0.25)] transition-all duration-500">
                  {v.imageUrl ? (
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[11px] tracking-[0.26em] uppercase text-foreground/40 font-semibold">
                        {v.brand}
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/70 via-[#1a1612]/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1.5 bg-[#fffdf8]/95 backdrop-blur-sm text-[10px] tracking-[0.22em] uppercase text-foreground/80 font-semibold rounded-sm border border-foreground/10">
                      {CATEGORY_META[cat]?.label ?? v.category}
                    </span>
                  </div>
                  {/* "Request this vehicle" gold button — slides up on hover */}
                  <div className="absolute bottom-5 left-5 right-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#d4b876] to-[#b08842] text-[#1a1612] rounded-sm text-[11px] tracking-[0.20em] uppercase font-bold sheen-gold">
                      Request this vehicle
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="px-1">
                  <p className="text-[11px] tracking-[0.22em] uppercase text-foreground/50 mb-2 font-semibold">
                    {v.brand}
                  </p>
                  <h3 className="text-[20px] font-semibold text-foreground mb-4 tracking-tight group-hover:text-[#b08842] transition-colors duration-300">
                    {v.name}
                  </h3>
                  <div className="flex items-center gap-6 text-[13px] text-foreground/70 font-medium">
                    <span className="flex items-center gap-2">
                      <Users size={14} strokeWidth={1.5} className="text-foreground/55" />
                      {v.seats} seats
                    </span>
                    <span className="flex items-center gap-2">
                      <Briefcase size={14} strokeWidth={1.5} className="text-foreground/55" />
                      {v.luggage} luggage
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA — full-width band below the carousel */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-16">
        <Reveal delay={200} className="flex justify-center">
          <LuxuryButton
            size="lg"
            variant="solid-dark"
            magnetic
            onClick={() => openBooking()}
          >
            Request a Quote for Any Vehicle
            <ArrowRight size={15} strokeWidth={2} />
          </LuxuryButton>
        </Reveal>
      </div>
    </section>
  );
}
