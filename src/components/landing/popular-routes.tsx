"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { POPULAR_ROUTES } from "@/lib/services-catalog";
import { useBookingStore } from "@/stores/booking-store";
import { useViewStore } from "@/stores/view-store";
import { getServiceBySlug } from "@/lib/services-catalog";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export function PopularRoutes() {
  const openBooking = useBookingStore((s) => s.openModal);
  const setActiveService = useViewStore((s) => s.setActiveService);
  const setBookingTab = useViewStore((s) => s.setBookingTab);

  const handleClick = (routeId: string) => {
    const route = POPULAR_ROUTES.find((r) => r.id === routeId);
    if (!route) return;
    openBooking({
      widgetPrefill: {
        pickup: route.from,
        destination: route.to,
        service: route.service,
        bookingTab: getServiceBySlug(route.service)?.bookingTab ?? "one-way",
      },
    });
  };

  return (
    <section className="py-32 lg:py-44 border-t border-foreground/[0.10]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-eyebrow mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[#b08842]" />
            Available Journeys
          </p>
          <h2 className="text-headline text-foreground mb-7">
            Popular routes across
            <br />
            <span className="text-foreground/40">Saudi Arabia.</span>
          </h2>
          <p className="text-body-lg max-w-xl">
            Frequently booked journeys, ready to dispatch. Tap any route to
            pre-fill the booking widget — our concierge responds on WhatsApp
            with a tailored quote.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map((route, i) => {
            const service = getServiceBySlug(route.service);
            return (
              <Reveal
                key={route.id}
                delay={Math.min(i * 70, 420)}
                className="surface-luxury p-7 cursor-pointer group"
              >
                <button
                  onClick={() => handleClick(route.id)}
                  className="text-left w-full"
                >
                  {/* Route header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.20em] uppercase text-foreground/45 font-semibold mb-1.5">
                        From
                      </p>
                      <p className="text-[15px] font-semibold text-foreground truncate tracking-tight">
                        {route.from}
                      </p>
                      <p className="text-[10.5px] text-foreground/50 mt-0.5">{route.fromRegion}</p>
                    </div>
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#b08842]/15 flex items-center justify-center text-[#b08842] group-hover:bg-[#b08842] group-hover:text-[#1a1612] transition-all duration-300">
                      <ArrowRight
                        size={14}
                        strokeWidth={2}
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.20em] uppercase text-foreground/45 font-semibold mb-1.5">
                        To
                      </p>
                      <p className="text-[15px] font-semibold text-foreground truncate tracking-tight">
                        {route.to}
                      </p>
                      <p className="text-[10.5px] text-foreground/50 mt-0.5">{route.toRegion}</p>
                    </div>
                  </div>

                  {/* Route meta */}
                  <div className="flex items-center gap-4 pt-5 border-t border-foreground/[0.10] text-[12px] text-foreground/70 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} strokeWidth={1.5} />
                      {route.durationHours < 1
                        ? `${Math.round(route.durationHours * 60)} min`
                        : `${route.durationHours} hr`}
                    </span>
                    <span className="text-foreground/30">·</span>
                    <span>{route.distanceKm} km</span>
                    <span className="text-foreground/30">·</span>
                    <span className="text-[#b08842] font-semibold tracking-[0.10em] uppercase text-[10px]">
                      {service?.shortLabel ?? route.service}
                    </span>
                  </div>

                  {route.note && (
                    <p className="mt-4 text-[12px] text-foreground/55 italic font-light leading-relaxed">
                      &ldquo;{route.note}&rdquo;
                    </p>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* CTA below the grid */}
        <Reveal delay={200} className="mt-14 text-center">
          <p className="text-[13px] text-foreground/60 mb-4 font-normal">
            Don&apos;t see your route? We cover every city in the Kingdom.
          </p>
          <button
            onClick={() => openBooking()}
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-[#b08842] hover:text-[#8a6d3b] font-semibold transition-colors"
          >
            <span className="gold-underline">Request a custom quote</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
