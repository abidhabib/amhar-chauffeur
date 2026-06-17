"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#fleet", label: "Fleet" },
  { href: "#how", label: "How it works" },
  { href: "#testimonials", label: "Clients" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const openBooking = useBookingStore((s) => s.openModal);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-foreground/[0.06]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Wordmark */}
          <a
            href="#top"
            className="flex items-center gap-2.5 group"
            aria-label="AMHAR home"
          >
            <span className="text-[15px] font-medium tracking-[0.32em] text-foreground">
              AMHAR
            </span>
            <span className="hidden sm:inline text-[10px] tracking-[0.24em] uppercase text-foreground/40 group-hover:text-[#c9a961] transition-colors duration-300">
              Chauffeur
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] tracking-[0.14em] uppercase text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+966503152119"
              className="hidden lg:inline text-[12px] tracking-[0.14em] uppercase text-foreground/60 hover:text-foreground transition-colors duration-200"
            >
              +966 50 315 2119
            </a>
            <LuxuryButton
              size="sm"
              variant="solid-gold"
              onClick={() => openBooking()}
              className="hidden sm:inline-flex"
            >
              Request a Quote
            </LuxuryButton>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 -mr-2 text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-foreground/[0.06] bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[12px] tracking-[0.18em] uppercase text-foreground/80"
              >
                {link.label}
              </a>
            ))}
            <LuxuryButton
              size="md"
              variant="solid-gold"
              onClick={() => {
                setMobileOpen(false);
                openBooking();
              }}
              className="mt-3"
            >
              Request a Quote
            </LuxuryButton>
          </nav>
        </div>
      )}
    </header>
  );
}
