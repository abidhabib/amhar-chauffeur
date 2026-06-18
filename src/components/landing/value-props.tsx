"use client";

import { Plane, Building2, Clock, MapPin, Car, Hotel, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { useBookingStore } from "@/stores/booking-store";

const SERVICES = [
  {
    icon: Plane,
    title: "Airport Transfer",
    description:
      "Meet & greet at arrivals. Real-time flight tracking. Sixty minutes of complimentary waiting time. A seamless transition from gate to destination.",
  },
  {
    icon: Building2,
    title: "Corporate & Events",
    description:
      "Punctual, discreet transportation for delegations, executive meetings, and high-profile events. Multi-vehicle coordination available on request.",
  },
  {
    icon: MapPin,
    title: "City to City",
    description:
      "The considered alternative to short-haul flights and rail. Travel between cities in total privacy, with the rhythm of your schedule, not ours.",
  },
  {
    icon: Hotel,
    title: "Hotel Transfer",
    description:
      "Door-to-door luxury from terminal to residence. We service every major hotel and private address across Riyadh and beyond.",
  },
  {
    icon: Car,
    title: "Hourly Charter",
    description:
      "A dedicated chauffeur at your disposal — by the hour or by the day. For meetings that move, schedules that shift, days that matter.",
  },
  {
    icon: Clock,
    title: "Middle East Transfer",
    description:
      "Cross-border chauffeur service to Bahrain, the UAE, and Qatar. The same standard, extended across the region.",
  },
];

export function ValueProps() {
  const openBooking = useBookingStore((s) => s.openModal);

  return (
    <section
      id="services"
      className="relative py-32 lg:py-44 bg-background"
    >
      {/* Top gradient transition from dark hero to ivory services */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #0f0c08 0%, rgba(15, 12, 8, 0.6) 40%, transparent 100%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <Reveal className="max-w-3xl mb-20">
          <p className="text-eyebrow mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[#b08842]" />
            Our Services
          </p>
          <h2 className="text-headline text-foreground mb-7">
            Considered transportation,
            <br />
            <span className="text-foreground/40">for every occasion.</span>
          </h2>
          <p className="text-body-lg max-w-xl">
            Six core services, each refined over thousands of journeys. Every
            booking is bespoke — we tailor the vehicle, the route, and the
            experience to your specific requirements.
          </p>
        </Reveal>

        {/* Service grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/[0.10] border border-foreground/[0.10] rounded-sm overflow-hidden">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.title}
                delay={Math.min(i * 70, 420)}
                className="bg-card hover:bg-[#fffdf8] cursor-pointer transition-colors duration-400 group relative"
              >
                <div className="p-9 lg:p-11 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-9">
                    <div className="w-14 h-14 flex items-center justify-center rounded-sm border border-foreground/15 text-foreground/75 group-hover:border-[#b08842]/60 group-hover:text-[#b08842] group-hover:bg-[#b08842]/[0.08] group-hover:shadow-[0_8px_24px_-8px_rgba(176,136,66,0.3)] transition-all duration-400">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] tracking-[0.22em] text-foreground/45 font-semibold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-[21px] font-semibold text-foreground mb-4 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-foreground/70 font-normal flex-1">
                    {s.description}
                  </p>
                  <button
                    onClick={() => openBooking()}
                    className="mt-7 inline-flex items-center gap-2.5 text-[12px] tracking-[0.18em] uppercase text-foreground/60 group-hover:text-[#b08842] transition-colors duration-300 self-start font-semibold"
                  >
                    <span className="gold-underline">Request this service</span>
                    <ArrowRight
                      size={12}
                      strokeWidth={2.5}
                      className="transition-transform duration-400 group-hover:translate-x-1.5"
                    />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
