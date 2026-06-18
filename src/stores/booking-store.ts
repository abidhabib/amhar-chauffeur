/**
 * Booking modal store — controls the multi-step modal visibility and
 * optionally preselects a vehicle category (when triggered from fleet cards).
 */
import { create } from "zustand";
import type { VehicleCategory } from "@/lib/dto/lead.dto";

interface BookingState {
  open: boolean;
  preselectedCategory: VehicleCategory | null;
  preselectedVehicleId: string | null;
  preselectedVehicleName: string | null;
  openModal: (opts?: {
    category?: VehicleCategory;
    vehicleId?: string;
    vehicleName?: string;
  }) => void;
  closeModal: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  open: false,
  preselectedCategory: null,
  preselectedVehicleId: null,
  preselectedVehicleName: null,
  openModal: (opts) =>
    set({
      open: true,
      preselectedCategory: opts?.category ?? null,
      preselectedVehicleId: opts?.vehicleId ?? null,
      preselectedVehicleName: opts?.vehicleName ?? null,
    }),
  closeModal: () => set({ open: false }),
}));
