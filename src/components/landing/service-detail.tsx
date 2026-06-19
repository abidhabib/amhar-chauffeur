"use client";

import { motion } from "framer-motion";
import {
  MapPin, Plane, Car, Clock, Hotel, Sparkles,
  ArrowRight, ArrowLeft, Check,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { useViewStore } from "@/stores/view-store";
import { BookingWidget } from "@/components/booking/booking-widget";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { Reveal } from "@/components/shared/reveal";
import {
  SERVICES_CATALOG,
  POPULAR_ROUTES,
  type ServiceSlug,
} from "@/lib/services-catalog";
import { FleetShowcase } from "@/components/landing/fleet-showcase";
import type { FleetWithFeatures } from "@/lib/dto/fleet.dto";

const SERVICE_ICONS: Record<ServiceSlug, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  "city-to-city": MapPin,
  "chauffeur-hailing": Car,
  "airport-transfer": Plane,
  "hourly-car-service": Clock,
  "chauffeur-service": Car,
  "limousine-service": Sparkles,
};

interface Props {
  serviceSlug: ServiceSlug;
  fleet: FleetWithFeatures[];
}

export function ServiceDetail({ serviceSlug, fleet }: Props) {
  const service = SERVICES_CATALOG.find((s) => s.slug === serviceSlug);
  const openBooking = useBookingStore((s) => s.openModal);
  const setActiveService = useViewStore((s) => s.setActiveService);

  if (!service) return null;

  const Icon = SERVICE_ICONS[service.slug];
  const relatedRoutes = POPULAR_ROUTES.filter((r) => r.service === service.slug);

  return (
    <div className="min-h-screen">
      {/* Service hero — dark, cinematic */}
      <section className="relative min-h-[60vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0f0c08]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=2400&q=85"
            alt=""
            className="w-full h-full object-cover opacity-30"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c08]/85 via-[#0f0c08]/70 to-[#0f0c08]/90" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 70% 35%, rgba(212, 184, 118, 0.18) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <button
              onClick={() => setActiveService(null)}
              className="flex items-center gap-2 text-[11px] tracking-[0.20em] uppercase text-[#d4b876]/80 hover:text-[#d4b876] font-semibold mb-8 transition-colors"
            >
              <ArrowLeft size={13} strokeWidth={2} />
              Back to home
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 flex items-center justify-center rounded-sm border border-[#d4b876]/40 bg-[#d4b876]/[0.08] text-[#d4b876]">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-[#d4b876]">
                {service.tagline}
              </p>
            </div>

            <h1 className="text-[clamp(2.25rem,5.5vw,4rem)] font-light leading-[1.05] tracking-[-0.025em] text-[#f6f1e9] mb-7">
              {service.label}
            </h1>

            <p className="text-[clamp(1.0625rem,1.4vw,1.25rem)] font-normal leading-[1.75] text-[#f6f1e9]/80 max-w-2xl mb-10">
              {service.longDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <LuxuryButton
                size="lg"
                variant="solid-gold"
                magnetic
                onClick={() => openBooking({ widgetPrefill: { service: service.slug, bookingTab: service.bookingTab } })}
              >
                Book {service.shortLabel}
                <ArrowRight size={15} strokeWidth={2} />
              </LuxuryButton>
              <a href="https://wa.me/966503152119" target="_blank" rel="noreferrer">
                <LuxuryButton size="lg" variant="solid-light" magnetic>
                  Talk to Concierge
                </LuxuryButton>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking widget section */}
      <section className="relative -mt-12 pb-20 z-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-7">
              <p className="text-eyebrow mb-3 flex items-center gap-3">
                <span className="w-8 h-px bg-[#b08842]" />
                Book this service
              </p>
              <h2 className="text-[clamp(1.5rem,2.2vw,2rem)] font-semibold text-foreground tracking-tight">
                Get an instant quote
              </h2>
            </div>
            <BookingWidget defaultTab={service.bookingTab} service={service.slug} />
          </Reveal>
        </div>
      </section>

      {/* Use cases — what customers typically book this for */}
      <section className="py-20 border-t border-foreground/[0.10] bg-[#efe8dc]/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-3xl mb-12">
            <p className="text-eyebrow mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#b08842]" />
              Common Use Cases
            </p>
            <h2 className="text-headline text-foreground mb-6">
              What clients book this for
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.useCases.map((useCase, i) => (
              <Reveal
                key={useCase}
                delay={i * 80}
                className="flex items-start gap-4 p-6 rounded-sm border border-foreground/[0.10] bg-card"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#b08842]/15 text-[#b08842] flex items-center justify-center">
                  <Check size={14} strokeWidth={2.5} />
                </div>
                <p className="text-[14px] text-foreground/80 font-normal leading-relaxed flex-1">
                  {useCase}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Popular routes for this service (if any) */}
      {relatedRoutes.length > 0 && (
        <section className="py-20 border-t border-foreground/[0.10]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal className="max-w-3xl mb-12">
              <p className="text-eyebrow mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-[#b08842]" />
                Popular Journeys
              </p>
              <h2 className="text-headline text-foreground mb-6">
                Frequently booked {service.shortLabel.toLowerCase()} routes
              </h2>
              <p className="text-body-lg max-w-xl">
                Tap any journey to pre-fill the booking widget — our concierge
                will respond on WhatsApp with a tailored quote.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedRoutes.map((route, i) => (
                <Reveal
                  key={route.id}
                  delay={i * 80}
                  className="surface-luxury p-6 cursor-pointer group"
                >
                  <button
                    onClick={() =>
                      openBooking({
                        widgetPrefill: {
                          pickup: route.from,
                          destination: route.to,
                          service: service.slug,
                          bookingTab: service.bookingTab,
                        },
                      })
                    }
                    className="text-left w-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] tracking-[0.18em] uppercase text-foreground/50 font-semibold mb-1">
                          From
                        </p>
                        <p className="text-[14px] font-semibold text-foreground truncate">
                          {route.from}
                        </p>
                      </div>
                      <ArrowRight
                        size={16}
                        strokeWidth={1.5}
                        className="flex-shrink-0 text-[#b08842] group-hover:translate-x-1 transition-transform duration-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] tracking-[0.18em] uppercase text-foreground/50 font-semibold mb-1">
                          To
                        </p>
                        <p className="text-[14px] font-semibold text-foreground truncate">
                          {route.to}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-foreground/[0.08] text-[11.5px] text-foreground/65 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} strokeWidth={1.5} />
                        {route.durationHours < 1
                          ? `${Math.round(route.durationHours * 60)} min`
                          : `${route.durationHours} hr`}
                      </span>
                      <span className="text-foreground/30">·</span>
                      <span>{route.distanceKm} km</span>
                      {route.note && (
                        <>
                          <span className="text-foreground/30">·</span>
                          <span className="text-foreground/55 truncate italic">{route.note}</span>
                        </>
                      )}
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service-specific fleet showcase */}
      <FleetShowcase fleet={fleet} />

      {/* CTA */}
      <section className="py-20 border-t border-foreground/[0.10] bg-charcoal texture-noise relative">
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <Reveal>
            <h2 className="text-display text-ivory mb-7 max-w-2xl mx-auto">
              Ready to book <span className="text-gold-gradient italic font-normal">{service.shortLabel.toLowerCase()}</span>?
            </h2>
            <p className="text-body-lg text-ivory/75 max-w-xl mx-auto mb-10">
              Submit a request — our concierge responds on WhatsApp within minutes
              with a tailored quote and chauffeur assignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LuxuryButton
                size="lg"
                variant="solid-gold"
                magnetic
                onClick={() => openBooking({ widgetPrefill: { service: service.slug, bookingTab: service.bookingTab } })}
              >
                Request a Quote
                <ArrowRight size={15} strokeWidth={2} />
              </LuxuryButton>
              <a href="https://wa.me/966503152119" target="_blank" rel="noreferrer">
                <LuxuryButton size="lg" variant="solid-light" magnetic>
                  WhatsApp Concierge
                </LuxuryButton>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
