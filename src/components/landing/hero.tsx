"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.13,
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function LandingHero() {
  const openBooking = useBookingStore((s) => s.openModal);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] overflow-hidden bg-[#0f0c08]"
    >
      {/* Layered background — luxury car silhouette with deep, cinematic overlays */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ opacity: overlayOpacity }}
      >
        {/* Base image */}
        <img
          src="https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=2400&q=85"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden
        />

        {/* Deep tint — pushes the image into the background, gives text proper contrast */}
        <div className="absolute inset-0 bg-[#0f0c08]/75" />

        {/* Bottom-to-top fade — anchors the section to the ivory body below */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c08] via-[#0f0c08]/40 to-[#0f0c08]/60" />

        {/* Left-to-right gradient — pushes content to the left for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0c08] via-[#0f0c08]/70 to-transparent" />

        {/* Warm gold radial accent — adds cinematic luxury */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 70% 35%, rgba(212, 184, 118, 0.22) 0%, transparent 60%)",
          }}
        />

        {/* Subtle grain for tactile quality */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-40 pb-32 min-h-[100svh] flex flex-col justify-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-3xl">
          {/* Eyebrow with gold accent line */}
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex items-center gap-4 mb-10 text-[12px] font-semibold tracking-[0.30em] uppercase text-[#d4b876]"
          >
            <span className="w-10 h-px bg-[#d4b876]" />
            Riyadh · Saudi Arabia · Middle East
          </motion.p>

          {/* Display headline — ivory with gold accent word */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[clamp(2.75rem,7vw,6rem)] font-light leading-[1.02] tracking-[-0.025em] text-[#f6f1e9] mb-10"
          >
            The journey,
            <br />
            <span className="font-normal italic bg-gradient-to-r from-[#ebd590] via-[#d4b876] to-[#b08842] bg-clip-text text-transparent">
              elevated.
            </span>
          </motion.h1>

          {/* Body — lifted to ivory/80 for proper contrast on dark hero bg */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[clamp(1.0625rem,1.4vw,1.25rem)] font-normal leading-[1.75] text-[#f6f1e9]/80 max-w-xl mb-12"
          >
            A private chauffeur service for those who travel with intention.
            Discreet, punctual, and uncompromising — for airports, boardrooms,
            and the moments in between.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <LuxuryButton
              size="lg"
              variant="solid-gold"
              magnetic
              onClick={() => openBooking()}
            >
              Request a Quote
              <ArrowRight size={15} strokeWidth={2} />
            </LuxuryButton>
            <LuxuryButton
              size="lg"
              variant="solid-light"
              magnetic
              onClick={() => {
                document
                  .getElementById("fleet")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              View the Fleet
            </LuxuryButton>
          </motion.div>

          {/* Trust strip — refined with gold divider accents */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-20 pt-9 border-t border-[#f6f1e9]/15 grid grid-cols-3 gap-6 max-w-2xl"
          >
            {[
              { value: "24/7", label: "Concierge" },
              { value: "30+", label: "Luxury Vehicles" },
              { value: "100%", label: "Verified Drivers" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={i > 0 ? "pl-6 border-l border-[#f6f1e9]/10" : ""}
              >
                <div className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-light text-[#f6f1e9] mb-1.5 tabular-nums leading-none">
                  {s.value}
                </div>
                <div className="text-[11px] tracking-[0.24em] uppercase text-[#d4b876]/90 font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Direct phone CTA — floating in bottom-right */}
      <motion.a
        href="tel:+966503152119"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="hidden lg:flex absolute bottom-10 right-10 z-20 items-center gap-3 px-5 py-3.5 rounded-sm bg-[#f6f1e9]/10 backdrop-blur-md border border-[#f6f1e9]/15 text-[#f6f1e9] hover:bg-[#f6f1e9]/15 hover:border-[#d4b876]/40 transition-all duration-300 group"
      >
        <Phone size={14} strokeWidth={1.8} className="text-[#d4b876]" />
        <div className="text-left">
          <div className="text-[9px] tracking-[0.22em] uppercase text-[#f6f1e9]/55 font-semibold">
            Direct line
          </div>
          <div className="text-[13px] font-medium tracking-wide">+966 50 315 2119</div>
        </div>
      </motion.a>

      {/* Scroll cue — refined vertical line with shimmer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-[#f6f1e9]/55"
      >
        <span className="text-[11px] tracking-[0.30em] uppercase font-semibold">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-px h-10 overflow-hidden bg-[#f6f1e9]/20"
        >
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent via-[#d4b876] to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
