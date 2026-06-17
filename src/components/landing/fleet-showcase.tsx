"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Users, Briefcase } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const openBooking = useBookingStore((s) => s.openModal);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const sorted = [...fleet].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category as VehicleCategory);
    const bi = CATEGORY_ORDER.indexOf(b.category as VehicleCategory);
    if (ai !== bi) return ai - bi;
    return a.displayOrder - b.displayOrder;
  });

  return (
    <section
      id="fleet"
      className="py-32 lg:py-44 border-t border-foreground/[0.10] bg-[#efe8dc]/40"
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
              for every journey.
            </p>
          </div>

          {/* Scroll controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollBy(-440)}
              className="w-14 h-14 rounded-sm border border-foreground/20 flex items-center justify-center text-foreground/75 hover:border-[#b08842] hover:text-[#b08842] hover:bg-[#b08842]/[0.06] transition-all duration-300"
              aria-label="Previous vehicles"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollBy(440)}
              className="w-14 h-14 rounded-sm border border-foreground/20 flex items-center justify-center text-foreground/75 hover:border-[#b08842] hover:text-[#b08842] hover:bg-[#b08842]/[0.06] transition-all duration-300"
              aria-label="Next vehicles"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </Reveal>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-7 overflow-x-auto scrollbar-none pb-4 -mx-6 px-6 lg:-mx-10 lg:px-10 snap-x snap-mandatory"
        >
          {sorted.map((v, i) => {
            const cat = v.category as VehicleCategory;
            return (
              <motion.button
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(i * 0.05, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() =>
                  openBooking({
                    category: cat,
                    vehicleId: v.id,
                    vehicleName: v.name,
                  })
                }
                className="group flex-shrink-0 w-[320px] md:w-[360px] snap-start text-left"
              >
                {/* Image card */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-foreground/[0.04] mb-6 border border-foreground/[0.08] group-hover:border-[#b08842]/40 group-hover:shadow-[0_30px_60px_-25px_rgba(26,22,18,0.25)] transition-all duration-500">
                  {v.imageUrl ? (
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
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
                  {/* Vehicle name on image — visible on hover */}
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
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <Reveal delay={200} className="mt-16 flex justify-center">
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
