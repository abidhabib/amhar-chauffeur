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
      className="relative py-32 lg:py-40 border-t border-foreground/[0.08]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <Reveal className="max-w-3xl mb-20">
          <p className="text-eyebrow mb-6">Our Services</p>
          <h2 className="text-headline text-foreground mb-6">
            Considered transportation,
            <br />
            <span className="text-foreground/45">for every occasion.</span>
          </h2>
          <p className="text-body-lg max-w-xl">
            Six core services, each refined over thousands of journeys. Every
            booking is bespoke — we tailor the vehicle, the route, and the
            experience to your specific requirements.
          </p>
        </Reveal>

        {/* Service grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/[0.08] border border-foreground/[0.08]">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.title}
                delay={Math.min(i * 60, 360)}
                className="bg-background hover:bg-foreground/[0.025] cursor-pointer transition-colors duration-300 group relative"
              >
                <div className="p-8 lg:p-10 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 flex items-center justify-center rounded-sm border border-foreground/12 text-foreground/75 group-hover:border-[#c9a961]/50 group-hover:text-[#c9a961] group-hover:bg-[#c9a961]/[0.06] transition-all duration-300">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] tracking-[0.2em] text-foreground/40 font-medium">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-[19px] font-medium text-foreground mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-foreground/70 font-normal flex-1">
                    {s.description}
                  </p>
                  {/* "Learn more" gold underline reveal */}
                  <button
                    onClick={() => openBooking()}
                    className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-foreground/55 group-hover:text-[#c9a961] transition-colors duration-300 self-start font-medium"
                  >
                    <span className="gold-underline">Request this service</span>
                    <ArrowRight
                      size={11}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-1"
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
