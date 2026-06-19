"use client";

import { useEffect, useState } from "react";
import { useViewStore } from "@/stores/view-store";
import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { ValueProps } from "@/components/landing/value-props";
import { FleetShowcase } from "@/components/landing/fleet-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { PopularRoutes } from "@/components/landing/popular-routes";
import { LandingFooter } from "@/components/landing/footer";
import { BookingModal } from "@/components/booking/booking-modal";
import { AdminShell } from "@/components/admin/admin-shell";
import { ServiceDetail } from "@/components/landing/service-detail";
import { CursorGlow } from "@/components/shared/cursor-glow";
import type { FleetWithFeatures } from "@/lib/dto/fleet.dto";

interface Review {
  id: string;
  clientName: string;
  clientTitle: string | null;
  rating: number;
  body: string;
  source: string;
  createdAt: string;
}

export default function Home() {
  const view = useViewStore((s) => s.view);
  const activeService = useViewStore((s) => s.activeService);
  const [fleet, setFleet] = useState<FleetWithFeatures[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewAgg, setReviewAgg] = useState<{ average: number; count: number }>({ average: 0, count: 0 });

  useEffect(() => {
    // Load fleet + reviews in parallel (public endpoints)
    Promise.all([
      fetch("/api/fleet").then((r) => r.json()),
      fetch("/api/reviews").then((r) => r.json()),
    ]).then(([f, r]) => {
      if (f?.items) setFleet(f.items);
      if (r?.items) setReviews(r.items);
      if (r?.average) setReviewAgg({ average: r.average, count: r.count ?? 0 });
    });
  }, []);

  // Scroll to top whenever activeService changes (so service detail starts at top)
  useEffect(() => {
    if (activeService) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeService]);

  if (view === "admin") {
    return <AdminShell />;
  }

  // Service detail view (replaces landing when a service is selected)
  if (activeService) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <CursorGlow />
        <LandingNav />
        <main className="flex-1">
          <ServiceDetail serviceSlug={activeService} fleet={fleet} />
        </main>
        <LandingFooter />
        <BookingModal />
      </div>
    );
  }

  // Default landing page
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CursorGlow />
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <ValueProps />
        <FleetShowcase fleet={fleet} />
        <PopularRoutes />
        <HowItWorks />
        <Testimonials reviews={reviews} average={reviewAgg.average} count={reviewAgg.count} />
      </main>
      <LandingFooter />
      <BookingModal />
    </div>
  );
}
