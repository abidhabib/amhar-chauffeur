"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, MapPin, Car, Clock, Building2, Crown,
  ArrowRight, ChevronDown, Check,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

// =====================================================
// Service Sections (alternating image/text)
// =====================================================
const SERVICE_SECTIONS = [
  {
    id: "airport",
    icon: Plane,
    title: "Airport Transfers",
    tagline: "Stress-free airport pickups across all major KSA airports",
    description:
      "Begin and end your journey with the same standard of luxury. Our chauffeurs monitor your flight in real time, greet you at arrivals with a personalized name sign, and assist with your luggage. Sixty minutes of complimentary waiting time means you never feel rushed — even when immigration takes longer than expected.",
    benefits: [
      "Real-time flight tracking for delays & early arrivals",
      "Meet & Greet at the arrivals hall",
      "60 minutes free waiting time",
      "Luggage assistance included",
      "All major KSA airports covered",
    ],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc7c?auto=format&fit=crop&w=1600&q=80",
    cta: "Book Airport Transfer",
  },
  {
    id: "city-to-city",
    icon: MapPin,
    title: "City to City",
    tagline: "The considered alternative to short-haul flights",
    description:
      "Travel between Saudi cities in total privacy, with the rhythm of your schedule — not the airline's. Door-to-door service means no airport queues, no security delays, no connecting transfers. Just you, your chauffeur, and the open road. Ideal for Riyadh ↔ Jeddah, Jeddah ↔ Makkah, Madinah ↔ Yanbu, and Eastern Province commutes.",
    benefits: [
      "Door-to-door, no airport hassle",
      "Travel on your schedule, not the airline's",
      "Cross-country comfort — work or rest en route",
      "Privacy to take calls or hold meetings",
      "Bottled water, Wi-Fi, and phone chargers onboard",
    ],
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
    cta: "Book City-to-City",
  },
  {
    id: "hourly",
    icon: Clock,
    title: "Hourly Chauffeur",
    tagline: "A dedicated chauffeur at your disposal, by the hour",
    description:
      "For days that don't fit a single destination. Multi-meeting business days, weddings with multiple venues, shopping tours, or just the luxury of having a driver waiting on standby. Minimum 2 hours, with flexible scheduling that adapts to your day as it unfolds.",
    benefits: [
      "Minimum 2 hours, max 12 hours",
      "Chauffeur waits on standby between stops",
      "Perfect for multi-meeting business days",
      "Ideal for weddings & private events",
      "Change destinations on the fly",
    ],
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80",
    cta: "Book Hourly Hire",
  },
  {
    id: "corporate",
    icon: Building2,
    title: "Corporate Travel",
    tagline: "Punctual, discreet transportation for delegations and executives",
    description:
      "We move the people who move your business. From single-executive airport transfers to multi-vehicle delegations for conferences and board meetings, our corporate service handles protocol, scheduling, and confidentiality with the discretion your business demands. Invoicing available.",
    benefits: [
      "Multi-vehicle coordination for delegations",
      "Corporate invoicing & consolidated billing",
      "Protocol-aware chauffeurs for VIP clients",
      "NDA-friendly — discretion is standard",
      "Dedicated account manager",
    ],
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
    cta: "Book Corporate Travel",
  },
  {
    id: "events",
    icon: Car,
    title: "Event Transportation",
    tagline: "For weddings, galas, conferences, and private celebrations",
    description:
      "Make every arrival memorable. Our event transportation service covers weddings, gala dinners, conferences, product launches, and private celebrations. Multi-vehicle bookings, coordinated timing, and chauffeurs who understand that the journey sets the tone for the event.",
    benefits: [
      "Multi-vehicle bookings for large parties",
      "Coordinated timing across multiple pickups",
      "Decorated vehicles available on request",
      "Late-night return service",
      "Chauffeurs in formal attire",
    ],
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=80",
    cta: "Book Event Transport",
  },
  {
    id: "vip",
    icon: Crown,
    title: "VIP Executive Travel",
    tagline: "The pinnacle of discretion, security, and refinement",
    description:
      "For dignitaries, heads of state, C-suite executives, and high-profile individuals. Our VIP service pairs our most experienced chauffeurs with our most discreet vehicles — privacy partitions, tinted glass, and chauffeurs trained in security protocol. Available 24/7 with advance booking.",
    benefits: [
      "Privacy partition & tinted glass standard",
      "Chauffeurs trained in security protocol",
      "Advance route planning & risk assessment",
      "24/7 availability with advance booking",
      "Non-disclosure agreements on request",
    ],
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1600&q=80",
    cta: "Book VIP Travel",
  },
];

// =====================================================
// FAQ Data — 10 premium FAQs
// =====================================================
const FAQS = [
  {
    q: "How do I book a chauffeur with AMHAR?",
    a: "Booking is simple. Use the search widget on our homepage or any service page to enter your pickup, destination, date, and time. You'll see available vehicle classes with instant pricing. Select your vehicle, complete the contact form, and our concierge team will confirm your booking via WhatsApp within minutes. No payment is required until confirmation.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations are free of charge up to 24 hours before your scheduled pickup time. Cancellations within 24 hours may incur a 50% charge. Cancellations within 2 hours of pickup, or no-shows, are charged in full. To cancel, simply message us on WhatsApp or call +966 50 315 2119 with your booking reference (format: AMH-YYYY-XXXX).",
  },
  {
    q: "How long will the chauffeur wait for me?",
    a: "For airport transfers, we include 60 minutes of complimentary waiting time from the moment your flight lands — so even if immigration or baggage claim takes longer than expected, your driver will be waiting. For non-airport pickups, we include 15 minutes of free waiting time. After that, additional waiting time is billed at SAR 100 per hour, pro-rated in 15-minute increments.",
  },
  {
    q: "Do you monitor flights for delays and early arrivals?",
    a: "Yes. For every airport pickup, our dispatch team monitors your flight in real time using live flight tracking data. If your flight is delayed, your chauffeur will adjust their arrival time accordingly — at no extra cost to you. If your flight arrives early, we'll do our best to have a chauffeur ready, though we recommend providing your flight number at booking so we can prepare.",
  },
  {
    q: "How much luggage can I bring?",
    a: "Each vehicle class has a specified luggage capacity, displayed on the vehicle detail page. As a general guide: Business Class sedans accommodate 2 large suitcases + 2 carry-ons. Business Vans accommodate up to 7 large suitcases. First Class SUVs (Cadillac Escalade, Range Rover) accommodate 4-6 large suitcases. If you're traveling with excess luggage, please mention it in your booking notes — we may recommend a larger vehicle at no extra charge.",
  },
  {
    q: "Are child seats available?",
    a: "Yes. We provide child seats and booster seats free of charge on request. Simply select the option during booking or mention it in your booking notes. We carry age-appropriate seats that comply with Saudi traffic regulations. Please specify your child's age and weight so we can prepare the correct seat.",
  },
  {
    q: "Are your chauffeurs trained and vetted?",
    a: "Every AMHAR chauffeur is background-checked, holds a valid Saudi commercial driving license, and completes our in-house training program covering VIP protocol, defensive driving, English language, and customer service. Many of our chauffeurs have 10+ years of experience driving executives, dignitaries, and high-profile clients. All chauffeurs are required to maintain immaculate personal presentation and arrive in formal attire.",
  },
  {
    q: "How is pricing calculated? Are there hidden fees?",
    a: "Our pricing is transparent and quote-based. The price you see on the search results page is the total price you pay — it includes the base fare, all taxes (15% VAT), tolls, fuel, driver fee, and standard amenities (water, phone chargers, Wi-Fi). There are no hidden fees. The only potential additions are: extra waiting time beyond the free allowance (SAR 100/hr), additional stops requested after booking, or late-night surcharges between 11 PM and 5 AM (15% surcharge).",
  },
  {
    q: "Can I book for business travel with invoicing?",
    a: "Absolutely. We work with hundreds of corporate clients across Saudi Arabia. For business bookings, we offer monthly invoicing, consolidated billing across multiple bookings, dedicated account management, and priority dispatch. To set up a corporate account, contact our business team at booking@amharksa.com or via WhatsApp — we'll typically have your account active within 24 hours.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, Mada (Saudi debit), Apple Pay, and cash (SAR only). For corporate clients, we offer monthly invoicing with net-15 or net-30 payment terms. Payment is collected after your journey is completed — we never charge your card at the time of booking. A pre-authorization may be placed on your card to validate it, but no charge is made until the service is delivered.",
  },
];

// =====================================================
// Main Services Page Component
// =====================================================
interface Props {
  fleet?: any[];
}

export function ServicesPage({ fleet: _fleet }: Props) {
  const openBooking = useBookingStore((s) => s.openModal);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0f0c08]">
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
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <p className="flex items-center gap-4 mb-7 text-[12px] font-semibold tracking-[0.30em] uppercase text-[#d4b876]">
              <span className="w-10 h-px bg-[#d4b876]" />
              Our Services
            </p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.02] tracking-[-0.025em] text-[#f6f1e9] mb-7">
              Considered transportation,
              <br />
              <span className="font-normal italic bg-gradient-to-r from-[#ebd590] via-[#d4b876] to-[#b08842] bg-clip-text text-transparent">
                for every journey.
              </span>
            </h1>
            <p className="text-[clamp(1.0625rem,1.4vw,1.25rem)] font-normal leading-[1.75] text-[#f6f1e9]/80 max-w-2xl mb-10">
              Six refined services for the discerning traveler — from airport
              transfers to VIP executive travel. Every booking is bespoke, every
              chauffeur is vetted, every detail is handled.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <LuxuryButton
                size="lg"
                variant="solid-gold"
                magnetic
                onClick={() => openBooking()}
              >
                Request a Quote
                <ArrowRight size={15} strokeWidth={2} />
              </LuxuryButton>
              <a href="#services-list">
                <LuxuryButton size="lg" variant="solid-light" magnetic>
                  Explore Services
                </LuxuryButton>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alternating Image/Text Sections */}
      <div id="services-list" className="bg-background">
        {SERVICE_SECTIONS.map((service, i) => (
          <ServiceAlternatingSection
            key={service.id}
            service={service}
            index={i}
            onBook={() => openBooking()}
          />
        ))}
      </div>

      {/* FAQ Section — always visible (no Reveal wrapper on items) */}
      <section className="py-24 lg:py-32 border-t border-foreground/[0.10] bg-[#efe8dc]/40">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-eyebrow mb-6 flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-[#b08842]" />
              Frequently Asked Questions
              <span className="w-8 h-px bg-[#b08842]" />
            </p>
            <h2 className="text-headline text-foreground mb-5">
              Everything you need to know
            </h2>
            <p className="text-body-lg max-w-2xl mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Reach out to our
              concierge team on WhatsApp — we respond within minutes.
            </p>
          </div>

          {/* FAQ items — NOT wrapped in Reveal so they're always visible */}
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqAccordion key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 border-t border-foreground/[0.10] bg-charcoal texture-noise relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212, 184, 118, 0.18) 0%, transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <h2 className="text-display text-ivory mb-7 max-w-2xl mx-auto">
            Ready to book your <span className="text-gold-gradient italic font-normal">journey?</span>
          </h2>
          <p className="text-body-lg text-ivory/75 max-w-xl mx-auto mb-10">
            Our concierge team is available 24/7 — submit a request and we&apos;ll
            respond on WhatsApp within minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LuxuryButton
              size="lg"
              variant="solid-gold"
              magnetic
              onClick={() => openBooking()}
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
        </div>
      </section>
    </div>
  );
}

// =====================================================
// Alternating Image/Text Section
// =====================================================
function ServiceAlternatingSection({
  service,
  index,
  onBook,
}: {
  service: typeof SERVICE_SECTIONS[number];
  index: number;
  onBook: () => void;
}) {
  const Icon = service.icon;
  const isReversed = index % 2 === 1; // alternate image side

  return (
    <div
      className={cn(
        "py-16 lg:py-24 border-b border-foreground/[0.08]",
        index % 2 === 1 && "bg-[#efe8dc]/30",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Image */}
          <div
            className={cn(
              "relative aspect-[4/3] rounded-xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(26,22,18,0.35)] group",
              isReversed && "lg:order-2",
            )}
          >
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c08]/40 via-transparent to-transparent" />
            {/* Icon badge on image */}
            <div className="absolute top-6 left-6 w-14 h-14 rounded-xl bg-card/95 backdrop-blur-md border border-foreground/10 flex items-center justify-center text-[#b08842] shadow-lg">
              <Icon size={22} strokeWidth={1.5} />
            </div>
            {/* Title on image (mobile only) */}
            <div className="absolute bottom-6 left-6 right-6 lg:hidden">
              <p className="text-[11px] tracking-[0.24em] uppercase text-[#d4b876] font-semibold mb-1">
                Service 0{index + 1}
              </p>
              <h3 className="text-[24px] font-semibold text-ivory tracking-tight">
                {service.title}
              </h3>
            </div>
          </div>

          {/* Text content */}
          <div
            className={cn(
              "flex flex-col",
              isReversed && "lg:order-1",
            )}
          >
            <p className="text-eyebrow mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-[#b08842]" />
              Service 0{index + 1}
            </p>
            <h3 className="text-[clamp(1.75rem,2.5vw,2.5rem)] font-semibold text-foreground mb-3 tracking-tight">
              {service.title}
            </h3>
            <p className="text-[15px] text-[#b08842] font-medium mb-5 tracking-wide">
              {service.tagline}
            </p>
            <p className="text-[15px] text-foreground/70 font-normal leading-relaxed mb-7 max-w-xl">
              {service.description}
            </p>

            {/* Benefits list — 2-column grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
              {service.benefits.map((benefit, bi) => (
                <li
                  key={bi}
                  className="flex items-start gap-2.5 text-[13.5px] text-foreground/75 font-normal"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#b08842]/15 text-[#b08842] flex items-center justify-center mt-0.5">
                    <Check size={11} strokeWidth={2.5} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div>
              <LuxuryButton
                size="md"
                variant="solid-dark"
                onClick={onBook}
              >
                {service.cta}
                <ArrowRight size={13} strokeWidth={2} />
              </LuxuryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// FAQ Accordion — always visible, no Reveal wrapper
// =====================================================
function FaqAccordion({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 30, 200), ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-xl border transition-all duration-300 overflow-hidden",
        open
          ? "border-[#b08842]/40 bg-card shadow-[0_15px_40px_-20px_rgba(176,136,66,0.25)]"
          : "border-foreground/[0.10] bg-card hover:border-foreground/20",
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
        aria-expanded={open}
      >
        <span
          className={cn(
            "text-[15px] sm:text-[16px] font-semibold tracking-tight transition-colors duration-200",
            open ? "text-[#b08842]" : "text-foreground",
          )}
        >
          {question}
        </span>
        <span
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            open ? "bg-[#b08842] text-[#1a1612] rotate-180" : "bg-foreground/[0.05] text-foreground/60",
          )}
        >
          <ChevronDown size={15} strokeWidth={2.5} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 sm:px-6 pb-6 text-[14px] sm:text-[14.5px] text-foreground/70 leading-relaxed font-normal">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
