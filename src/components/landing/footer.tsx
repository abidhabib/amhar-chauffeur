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
    <footer className="border-t border-foreground/[0.08] bg-ink">
      {/* Final CTA */}
      <section className="relative border-b border-foreground/[0.08] py-28 lg:py-36 overflow-hidden">
        {/* Subtle gold radial in the background */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, color-mix(in oklch, var(--gold) 10%, transparent) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <Reveal>
            <p className="text-eyebrow mb-8">Begin your journey</p>
            <h2 className="text-display text-foreground mb-8 max-w-3xl mx-auto">
              The next journey
              <br />
              <span className="text-gold-gradient italic font-normal">deserves more.</span>
            </h2>
            <p className="text-body-lg max-w-xl mx-auto mb-12">
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
                <ArrowRight size={14} strokeWidth={2} />
              </LuxuryButton>
              <a href="https://wa.me/966503152119" target="_blank" rel="noreferrer">
                <LuxuryButton size="lg" variant="outline" magnetic>
                  <MessageCircle size={14} strokeWidth={2} />
                  WhatsApp Concierge
                </LuxuryButton>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer body */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="text-[15px] font-semibold tracking-[0.32em] text-foreground">
                AMHAR
              </span>
              <span className="text-[10px] tracking-[0.24em] uppercase text-foreground/50 font-medium">
                Chauffeur
              </span>
            </div>
            <p className="text-[13.5px] text-foreground/70 font-normal max-w-md leading-relaxed mb-6">
              A private chauffeur service based in Riyadh, Saudi Arabia.
              Premium limousine and chauffeur-driven transportation for airport
              transfers, corporate travel, VIPs, and bespoke journeys across
              the Kingdom and the wider Middle East.
            </p>
            <div className="flex items-center gap-5 text-[12px] text-foreground/60">
              <a
                href="https://www.facebook.com/profile.php?id=61579634004083"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#c9a961] transition-colors duration-200 tracking-[0.14em] uppercase font-medium"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/amharchaufferservice/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#c9a961] transition-colors duration-200 tracking-[0.14em] uppercase font-medium"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/@AmharLimousine"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#c9a961] transition-colors duration-200 tracking-[0.14em] uppercase font-medium"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-eyebrow-muted mb-5">Contact</p>
            <ul className="space-y-3 text-[13.5px]">
              <li>
                <a
                  href="tel:+966503152119"
                  className="flex items-center gap-2 text-foreground/75 hover:text-foreground transition-colors duration-200"
                >
                  <Phone size={12} strokeWidth={1.5} />
                  +966 50 315 2119
                </a>
              </li>
              <li>
                <a
                  href="mailto:booking@amharksa.com"
                  className="flex items-center gap-2 text-foreground/75 hover:text-foreground transition-colors duration-200"
                >
                  <Mail size={12} strokeWidth={1.5} />
                  booking@amharksa.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/966503152119"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-foreground/75 hover:text-foreground transition-colors duration-200"
                >
                  <MessageCircle size={12} strokeWidth={1.5} />
                  WhatsApp Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-eyebrow-muted mb-5">Navigate</p>
            <ul className="space-y-3 text-[13.5px]">
              <li>
                <a href="#services" className="text-foreground/75 hover:text-foreground transition-colors duration-200">
                  Services
                </a>
              </li>
              <li>
                <a href="#fleet" className="text-foreground/75 hover:text-foreground transition-colors duration-200">
                  Fleet
                </a>
              </li>
              <li>
                <a href="#how" className="text-foreground/75 hover:text-foreground transition-colors duration-200">
                  How it works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-foreground/75 hover:text-foreground transition-colors duration-200">
                  Clients
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-foreground/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] tracking-[0.14em] uppercase text-foreground/50 font-medium">
            © {new Date().getFullYear()} AMHAR Premier Chauffeur Service
          </p>
          <div className="flex items-center gap-6 text-[11px] tracking-[0.14em] uppercase text-foreground/50 font-medium">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <button
              onClick={openAdmin}
              className="hover:text-[#c9a961] transition-colors"
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
