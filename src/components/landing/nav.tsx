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
  const [activeSection, setActiveSection] = useState<string>("");
  const openBooking = useBookingStore((s) => s.openModal);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      Boolean,
    ) as Element[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // When not scrolled (over dark hero), use ivory text.
  // When scrolled (over ivory body), use espresso text.
  const onDark = !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-400",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-foreground/[0.10]"
          : "bg-transparent border-b border-transparent",
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Wordmark */}
          <a
            href="#top"
            className="flex items-center gap-3 group"
            aria-label="AMHAR home"
          >
            <span
              className={cn(
                "text-[17px] font-semibold tracking-[0.34em] transition-colors duration-400",
                onDark ? "text-[#f6f1e9]" : "text-foreground",
              )}
            >
              AMHAR
            </span>
            <span
              className={cn(
                "hidden sm:inline text-[10px] tracking-[0.26em] uppercase transition-colors duration-400 font-semibold",
                onDark
                  ? "text-[#f6f1e9]/55 group-hover:text-[#d4b876]"
                  : "text-foreground/50 group-hover:text-[#b08842]",
              )}
            >
              Chauffeur
            </span>
          </a>

          {/* Desktop nav with scroll-spy */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-[13px] tracking-[0.14em] uppercase transition-colors duration-200 font-medium",
                    onDark
                      ? (active ? "text-[#f6f1e9]" : "text-[#f6f1e9]/65 hover:text-[#f6f1e9]")
                      : (active ? "text-foreground" : "text-foreground/60 hover:text-foreground"),
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px transition-all duration-400",
                      onDark ? "bg-[#d4b876]" : "bg-[#b08842]",
                      active ? "w-full" : "w-0",
                    )}
                    style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+966503152119"
              className={cn(
                "hidden lg:inline text-[13px] tracking-[0.14em] uppercase transition-colors duration-200 font-medium",
                onDark
                  ? "text-[#f6f1e9]/65 hover:text-[#f6f1e9]"
                  : "text-foreground/65 hover:text-foreground",
              )}
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

            <button
              className={cn(
                "md:hidden p-2 -mr-2 transition-colors duration-200",
                onDark ? "text-[#f6f1e9]" : "text-foreground",
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-foreground/[0.10] bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] tracking-[0.18em] uppercase text-foreground/80 font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+966503152119"
              className="text-[12px] tracking-[0.14em] uppercase text-foreground/65 font-medium"
            >
              +966 50 315 2119
            </a>
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
