/**
 * Booking modal store — controls the multi-step modal visibility and
 * optionally preselects a vehicle category (when triggered from fleet cards
 * or the booking widget).
 */
import { create } from "zustand";
import type { VehicleCategory } from "@/lib/dto/lead.dto";
import type { BookingTab, ServiceSlug } from "@/lib/services-catalog";

export interface BookingWidgetPrefill {
  pickup?: string;
  destination?: string;
  pickupDate?: string;
  pickupTime?: string;
  durationHours?: number;
  service?: ServiceSlug;
  bookingTab?: BookingTab;
}

interface BookingState {
  open: boolean;
  preselectedCategory: VehicleCategory | null;
  preselectedVehicleId: string | null;
  preselectedVehicleName: string | null;
  /** Prefill data coming from the booking widget (From, To, Date, Time, Duration) */
  widgetPrefill: BookingWidgetPrefill | null;
  openModal: (opts?: {
    category?: VehicleCategory;
    vehicleId?: string;
    vehicleName?: string;
    widgetPrefill?: BookingWidgetPrefill;
  }) => void;
  closeModal: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  open: false,
  preselectedCategory: null,
  preselectedVehicleId: null,
  preselectedVehicleName: null,
  widgetPrefill: null,
  openModal: (opts) =>
    set({
      open: true,
      preselectedCategory: opts?.category ?? null,
      preselectedVehicleId: opts?.vehicleId ?? null,
      preselectedVehicleName: opts?.vehicleName ?? null,
      widgetPrefill: opts?.widgetPrefill ?? null,
    }),
  closeModal: () => set({ open: false }),
}));
