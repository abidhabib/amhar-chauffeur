import { ServicesPage } from "@/components/landing/services-page";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { BookingModal } from "@/components/booking/booking-modal";
import { CursorGlow } from "@/components/shared/cursor-glow";
import type { FleetWithFeatures } from "@/lib/dto/fleet.dto";

export default function ServicesRoutePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CursorGlow />
      <LandingNav />
      <main className="flex-1">
        <ServicesPage fleet={[]} />
      </main>
      <LandingFooter />
      <BookingModal />
    </div>
  );
}
