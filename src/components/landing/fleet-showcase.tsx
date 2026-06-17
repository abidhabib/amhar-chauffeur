"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Users, Briefcase } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import type { FleetWithFeatures } from "@/lib/dto/fleet.dto";
import { CATEGORY_META, type VehicleCategory } from "@/lib/dto/lead.dto";
import { LuxuryButton } from "@/components/shared/luxury-button";

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

  // Sort: by category order, then displayOrder
  const sorted = [...fleet].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category as VehicleCategory);
    const bi = CATEGORY_ORDER.indexOf(b.category as VehicleCategory);
    if (ai !== bi) return ai - bi;
    return a.displayOrder - b.displayOrder;
  });

  return (
    <section id="fleet" className="py-32 lg:py-40 border-t border-foreground/[0.06]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="text-eyebrow mb-6">The Fleet</p>
            <h2 className="text-headline text-foreground mb-6">
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
              onClick={() => scrollBy(-420)}
              className="w-12 h-12 rounded-sm border border-foreground/15 flex items-center justify-center text-foreground/70 hover:border-foreground/40 hover:text-foreground transition-all duration-300"
              aria-label="Previous vehicles"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollBy(420)}
              className="w-12 h-12 rounded-sm border border-foreground/15 flex items-center justify-center text-foreground/70 hover:border-foreground/40 hover:text-foreground transition-all duration-300"
              aria-label="Next vehicles"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-4 -mx-6 px-6 lg:-mx-10 lg:px-10 snap-x snap-mandatory"
        >
          {sorted.map((v, i) => {
            const cat = v.category as VehicleCategory;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i * 0.05, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex-shrink-0 w-[300px] md:w-[340px] snap-start"
              >
                <button
                  onClick={() =>
                    openBooking({
                      category: cat,
                      vehicleId: v.id,
                      vehicleName: v.name,
                    })
                  }
                  className="block w-full text-left"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-foreground/[0.04] mb-5">
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt={v.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] tracking-[0.24em] uppercase text-foreground/30">
                          {v.brand}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-2.5 py-1 bg-background/80 backdrop-blur-sm text-[9px] tracking-[0.2em] uppercase text-foreground/70">
                        {CATEGORY_META[cat]?.label ?? v.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-1">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">
                      {v.brand}
                    </p>
                    <h3 className="text-[18px] font-medium text-foreground mb-4 tracking-tight">
                      {v.name}
                    </h3>
                    <div className="flex items-center gap-5 text-[12px] text-foreground/55">
                      <span className="flex items-center gap-1.5">
                        <Users size={13} strokeWidth={1.5} />
                        {v.seats} seats
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={13} strokeWidth={1.5} />
                        {v.luggage} luggage
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <LuxuryButton
            size="lg"
            variant="outline"
            onClick={() => openBooking()}
          >
            Request a Quote for Any Vehicle
            <ArrowRight size={14} strokeWidth={2} />
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
}
