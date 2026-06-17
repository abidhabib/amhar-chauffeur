"use client";

import { ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { useBookingStore } from "@/stores/booking-store";
import { useViewStore } from "@/stores/view-store";
import { Reveal } from "@/components/shared/reveal";

export function LandingFooter() {
  const openBooking = useBookingStore((s) => s.openModal);
  const openAdmin = useViewStore((s) => s.openAdmin);

  return (
    <footer className="border-t border-foreground/[0.10] bg-charcoal texture-noise relative">
      {/* Final CTA */}
      <section className="relative border-b border-ivory/[0.08] py-32 lg:py-40 overflow-hidden">
        {/* Gold radial in the background */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212, 184, 118, 0.18) 0%, transparent 65%)",
          }}
        />
        {/* Top gold accent line */}
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #d4b876, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <Reveal>
            <p className="text-eyebrow mb-8 justify-center flex items-center gap-3">
              <span className="w-8 h-px bg-[#d4b876]" />
              Begin your journey
              <span className="w-8 h-px bg-[#d4b876]" />
            </p>
            <h2 className="text-display text-ivory mb-9 max-w-3xl mx-auto">
              The next journey
              <br />
              <span className="text-gold-gradient italic font-normal">deserves more.</span>
            </h2>
            <p className="text-body-lg max-w-xl mx-auto mb-12 text-ivory/75">
              Submit a request today. Our concierge team will respond within
              minutes — tailored to your schedule, your destination, and your
              standard.
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
                  <MessageCircle size={15} strokeWidth={2} />
                  WhatsApp Concierge
                </LuxuryButton>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer body */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-7">
              <span className="text-[17px] font-semibold tracking-[0.34em] text-ivory">
                AMHAR
              </span>
              <span className="text-[10px] tracking-[0.26em] uppercase text-ivory/55 font-semibold">
                Chauffeur
              </span>
            </div>
            <p className="text-[15px] text-ivory/70 font-normal max-w-md leading-relaxed mb-7">
              A private chauffeur service based in Riyadh, Saudi Arabia.
              Premium limousine and chauffeur-driven transportation for airport
              transfers, corporate travel, VIPs, and bespoke journeys across
              the Kingdom and the wider Middle East.
            </p>
            <div className="flex items-center gap-6 text-[13px] text-ivory/60">
              <a
                href="https://www.facebook.com/profile.php?id=61579634004083"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#d4b876] transition-colors duration-200 tracking-[0.16em] uppercase font-semibold"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/amharchaufferservice/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#d4b876] transition-colors duration-200 tracking-[0.16em] uppercase font-semibold"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/@AmharLimousine"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#d4b876] transition-colors duration-200 tracking-[0.16em] uppercase font-semibold"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-eyebrow-muted mb-6 text-ivory/55">Contact</p>
            <ul className="space-y-4 text-[14.5px]">
              <li>
                <a
                  href="tel:+966503152119"
                  className="flex items-center gap-2.5 text-ivory/80 hover:text-[#d4b876] transition-colors duration-200"
                >
                  <Phone size={13} strokeWidth={1.5} />
                  +966 50 315 2119
                </a>
              </li>
              <li>
                <a
                  href="mailto:booking@amharksa.com"
                  className="flex items-center gap-2.5 text-ivory/80 hover:text-[#d4b876] transition-colors duration-200"
                >
                  <Mail size={13} strokeWidth={1.5} />
                  booking@amharksa.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/966503152119"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-ivory/80 hover:text-[#d4b876] transition-colors duration-200"
                >
                  <MessageCircle size={13} strokeWidth={1.5} />
                  WhatsApp Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-eyebrow-muted mb-6 text-ivory/55">Navigate</p>
            <ul className="space-y-4 text-[14.5px]">
              <li>
                <a href="#services" className="text-ivory/80 hover:text-[#d4b876] transition-colors duration-200">
                  Services
                </a>
              </li>
              <li>
                <a href="#fleet" className="text-ivory/80 hover:text-[#d4b876] transition-colors duration-200">
                  Fleet
                </a>
              </li>
              <li>
                <a href="#how" className="text-ivory/80 hover:text-[#d4b876] transition-colors duration-200">
                  How it works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-ivory/80 hover:text-[#d4b876] transition-colors duration-200">
                  Clients
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-ivory/[0.10] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] tracking-[0.16em] uppercase text-ivory/55 font-semibold">
            © {new Date().getFullYear()} AMHAR Premier Chauffeur Service
          </p>
          <div className="flex items-center gap-7 text-[12px] tracking-[0.16em] uppercase text-ivory/55 font-semibold">
            <a href="#" className="hover:text-ivory transition-colors">
              Privacy
            </a>
            <button
              onClick={openAdmin}
              className="hover:text-[#d4b876] transition-colors"
              title="Operator portal"
            >
              Operator Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
