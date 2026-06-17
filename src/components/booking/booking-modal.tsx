"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Check, MapPin, Calendar, Clock, Users, Briefcase, Phone, Mail, User, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useBookingStore } from "@/stores/booking-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { CATEGORY_META, VEHICLE_CATEGORIES, type VehicleCategory } from "@/lib/dto/lead.dto";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface FormState {
  // Step 1 — journey
  pickup: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  // Step 2 — vehicle
  vehicleCategory: VehicleCategory;
  vehicleId: string | null;
  passengers: number;
  luggage: number;
  // Step 3 — contact
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  notes: string;
}

const STEPS = ["Journey", "Vehicle", "Contact", "Review"] as const;

export function BookingModal() {
  const open = useBookingStore((s) => s.open);
  const closeModal = useBookingStore((s) => s.closeModal);
  const preselectedCategory = useBookingStore((s) => s.preselectedCategory);
  const preselectedVehicleId = useBookingStore((s) => s.preselectedVehicleId);
  const preselectedVehicleName = useBookingStore((s) => s.preselectedVehicleName);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    pickup: "",
    destination: "",
    pickupDate: "",
    pickupTime: "",
    vehicleCategory: "sedan",
    vehicleId: null,
    passengers: 1,
    luggage: 0,
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+966",
    notes: "",
  });

  // Apply preselection on first open
  const onOpenChange = (v: boolean) => {
    if (!v) {
      closeModal();
      // Reset after close animation
      setTimeout(() => {
        setStep(0);
        setSubmittedRef(null);
        setForm((f) => ({
          ...f,
          pickup: "",
          destination: "",
          pickupDate: "",
          pickupTime: "",
          fullName: "",
          email: "",
          phone: "",
          notes: "",
        }));
      }, 250);
    } else {
      // Apply preselection
      if (preselectedCategory || preselectedVehicleId) {
        setForm((f) => ({
          ...f,
          vehicleCategory: preselectedCategory ?? f.vehicleCategory,
          vehicleId: preselectedVehicleId ?? f.vehicleId,
        }));
      }
    }
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canProceed = (): boolean => {
    if (step === 0)
      return (
        form.pickup.trim().length >= 3 &&
        form.destination.trim().length >= 3 &&
        /^\d{4}-\d{2}-\d{2}$/.test(form.pickupDate) &&
        /^\d{2}:\d{2}$/.test(form.pickupTime)
      );
    if (step === 1)
      return form.passengers >= 1 && form.luggage >= 0;
    if (step === 2)
      return (
        form.fullName.trim().length >= 2 &&
        form.phone.trim().length >= 6 &&
        (form.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      );
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await api.createLead({
        ...form,
        email: form.email || undefined,
        notes: form.notes || undefined,
      });
      setSubmittedRef(res.reference);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] p-0 bg-background border-foreground/[0.08] rounded-sm overflow-hidden max-h-[92svh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            Submit your chauffeur request — we&apos;ll respond via WhatsApp within minutes.
          </DialogDescription>
        </VisuallyHidden>

        {/* Close button — top right */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Modal header — luxury header bar */}
        <div className="px-8 pt-9 pb-6 border-b border-foreground/[0.06]">
          <p className="text-eyebrow mb-3">Request a Quote</p>
          <h2 className="text-[24px] font-light text-foreground tracking-tight">
            {submittedRef ? "Request received" : "Tell us about your journey"}
          </h2>
          {!submittedRef && (
            <p className="text-[12px] text-foreground/50 mt-2 font-light">
              No payment required. We respond via WhatsApp within minutes.
            </p>
          )}
        </div>

        {submittedRef ? (
          <SuccessState reference={submittedRef} onClose={() => onOpenChange(false)} />
        ) : (
          <>
            {/* Step indicator */}
            <div className="px-8 py-5 border-b border-foreground/[0.06] flex items-center gap-3">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-3 flex-1 last:flex-none">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-300 ${
                      i < step
                        ? "bg-[#c9a961] text-[#0a0a0b]"
                        : i === step
                          ? "bg-foreground text-background"
                          : "border border-foreground/15 text-foreground/40"
                    }`}
                  >
                    {i < step ? <Check size={11} strokeWidth={2.5} /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                      i === step ? "text-foreground" : "text-foreground/40"
                    }`}
                  >
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-foreground/[0.08]" />
                  )}
                </div>
              ))}
            </div>

            {/* Step body */}
            <div className="px-8 py-8 min-h-[340px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step === 0 && <StepJourney form={form} update={update} />}
                  {step === 1 && (
                    <StepVehicle
                      form={form}
                      update={update}
                      preselectedVehicleName={preselectedVehicleName}
                    />
                  )}
                  {step === 2 && <StepContact form={form} update={update} />}
                  {step === 3 && <StepReview form={form} preselectedVehicleName={preselectedVehicleName} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer — nav buttons */}
            <div className="px-8 py-6 border-t border-foreground/[0.06] flex items-center justify-between gap-3">
              {step > 0 ? (
                <LuxuryButton
                  size="md"
                  variant="ghost"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={submitting}
                >
                  <ArrowLeft size={13} strokeWidth={2} />
                  Back
                </LuxuryButton>
              ) : (
                <div />
              )}

              {step < STEPS.length - 1 ? (
                <LuxuryButton
                  size="md"
                  variant="solid-gold"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                >
                  Continue
                  <ArrowRight size={13} strokeWidth={2} />
                </LuxuryButton>
              ) : (
                <LuxuryButton
                  size="md"
                  variant="solid-gold"
                  onClick={submit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                  {!submitting && <ArrowRight size={13} strokeWidth={2} />}
                </LuxuryButton>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// =====================================================================
// Step 1: Journey details
// =====================================================================
function StepJourney({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="space-y-6">
      <Field label="Pickup location" icon={<MapPin size={13} />}>
        <input
          type="text"
          value={form.pickup}
          onChange={(e) => update("pickup", e.target.value)}
          placeholder="e.g. King Khalid International Airport, Terminal 1"
          className="amhar-input"
        />
      </Field>

      <Field label="Destination" icon={<MapPin size={13} />}>
        <input
          type="text"
          value={form.destination}
          onChange={(e) => update("destination", e.target.value)}
          placeholder="e.g. The Ritz-Carlton, Riyadh"
          className="amhar-input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" icon={<Calendar size={13} />}>
          <input
            type="date"
            value={form.pickupDate}
            min={today}
            onChange={(e) => update("pickupDate", e.target.value)}
            className="amhar-input"
          />
        </Field>
        <Field label="Time" icon={<Clock size={13} />}>
          <input
            type="time"
            value={form.pickupTime}
            onChange={(e) => update("pickupTime", e.target.value)}
            className="amhar-input"
          />
        </Field>
      </div>
    </div>
  );
}

// =====================================================================
// Step 2: Vehicle & passengers
// =====================================================================
function StepVehicle({
  form,
  update,
  preselectedVehicleName,
}: {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  preselectedVehicleName: string | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-eyebrow-muted mb-3">Vehicle Category</p>
        <div className="grid grid-cols-2 gap-3">
          {VEHICLE_CATEGORIES.map((c) => {
            const meta = CATEGORY_META[c];
            const selected = form.vehicleCategory === c;
            return (
              <button
                key={c}
                onClick={() => update("vehicleCategory", c)}
                className={`p-4 text-left rounded-sm border transition-all duration-250 ${
                  selected
                    ? "border-[#c9a961] bg-[#c9a961]/[0.06]"
                    : "border-foreground/10 hover:border-foreground/30"
                }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <div className={`text-[13px] font-medium mb-1 ${selected ? "text-[#c9a961]" : "text-foreground"}`}>
                  {meta.label}
                </div>
                <div className="text-[11px] text-foreground/50 font-light leading-snug">
                  {meta.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {preselectedVehicleName && (
        <div className="px-4 py-3 rounded-sm border border-[#c9a961]/30 bg-[#c9a961]/[0.04]">
          <p className="text-[11px] text-foreground/55">
            <span className="text-[#c9a961] font-medium">Pre-selected:</span>{" "}
            {preselectedVehicleName}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <StepperField
          label="Passengers"
          icon={<Users size={13} />}
          value={form.passengers}
          min={1}
          max={30}
          onChange={(v) => update("passengers", v)}
        />
        <StepperField
          label="Luggage"
          icon={<Briefcase size={13} />}
          value={form.luggage}
          min={0}
          max={30}
          onChange={(v) => update("luggage", v)}
        />
      </div>

      <div>
        <label className="text-eyebrow-muted block mb-3">Additional notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="e.g. child seat required, multiple stops, VIP protocol"
          rows={3}
          className="w-full px-4 py-3 bg-transparent border border-foreground/10 rounded-sm text-[13px] font-light text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-[#c9a961] transition-colors duration-250 resize-none"
        />
      </div>
    </div>
  );
}

// =====================================================================
// Step 3: Contact details
// =====================================================================
function StepContact({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Field label="Full name" icon={<User size={13} />}>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Your full name"
          className="amhar-input"
        />
      </Field>

      <div>
        <label className="text-eyebrow-muted block mb-3">WhatsApp / Phone</label>
        <div className="flex gap-2">
          <select
            value={form.countryCode}
            onChange={(e) => update("countryCode", e.target.value)}
            className="amhar-input w-[110px] flex-shrink-0"
          >
            <option value="+966">🇸🇦 +966</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+973">🇧🇭 +973</option>
            <option value="+974">🇶🇦 +974</option>
            <option value="+965">🇰🇼 +965</option>
            <option value="+971">🇴🇲 +968</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+1">🇺🇸 +1</option>
          </select>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="50 315 2119"
            className="amhar-input flex-1"
          />
        </div>
      </div>

      <Field label="Email (optional)" icon={<Mail size={13} />}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          className="amhar-input"
        />
      </Field>

      <div className="flex items-start gap-2.5 pt-2 text-[11px] text-foreground/45 leading-relaxed">
        <MessageCircle size={12} className="mt-0.5 flex-shrink-0 text-[#c9a961]" strokeWidth={1.5} />
        <p>
          We&apos;ll contact you via WhatsApp within minutes of submission to
          confirm details and provide a tailored quote. Your information is
          held in strict confidence.
        </p>
      </div>
    </div>
  );
}

// =====================================================================
// Step 4: Review & submit
// =====================================================================
function StepReview({
  form,
  preselectedVehicleName,
}: {
  form: FormState;
  preselectedVehicleName: string | null;
}) {
  const rows = [
    { label: "Pickup", value: form.pickup },
    { label: "Destination", value: form.destination },
    {
      label: "Date & time",
      value: `${form.pickupDate} · ${form.pickupTime}`,
    },
    {
      label: "Vehicle",
      value:
        preselectedVehicleName ??
        `${CATEGORY_META[form.vehicleCategory].label} category`,
    },
    {
      label: "Passengers & luggage",
      value: `${form.passengers} passengers · ${form.luggage} luggage`,
    },
    { label: "Name", value: form.fullName },
    {
      label: "Contact",
      value: `${form.countryCode} ${form.phone}${form.email ? ` · ${form.email}` : ""}`,
    },
  ];

  return (
    <div>
      <p className="text-[12px] text-foreground/55 mb-6 font-light">
        Please review your request before submitting. You can step back to make changes.
      </p>
      <dl className="divide-y divide-foreground/[0.06] border-y border-foreground/[0.06]">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 gap-4 py-4">
            <dt className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 pt-0.5">
              {r.label}
            </dt>
            <dd className="col-span-2 text-[13px] text-foreground font-light">
              {r.value || <span className="text-foreground/40">—</span>}
            </dd>
          </div>
        ))}
      </dl>
      {form.notes && (
        <div className="mt-6 p-4 rounded-sm bg-foreground/[0.02] border border-foreground/[0.06]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">Notes</p>
          <p className="text-[13px] text-foreground/70 font-light">{form.notes}</p>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// Success state
// =====================================================================
function SuccessState({ reference, onClose }: { reference: string; onClose: () => void }) {
  return (
    <div className="px-8 py-12 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-14 h-14 rounded-full bg-[#c9a961] flex items-center justify-center mx-auto mb-6"
      >
        <Check size={22} strokeWidth={2.5} className="text-[#0a0a0b]" />
      </motion.div>
      <h3 className="text-[22px] font-light text-foreground mb-3 tracking-tight">
        Your request is in.
      </h3>
      <p className="text-[13px] text-foreground/55 font-light max-w-sm mx-auto mb-2">
        Our concierge team will contact you on WhatsApp within minutes to confirm
        details and provide a tailored quote.
      </p>
      <p className="text-[11px] tracking-[0.2em] uppercase text-foreground/40 mb-8">
        Reference: <span className="text-[#c9a961]">{reference}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={`https://wa.me/966503152119`} target="_blank" rel="noreferrer">
          <LuxuryButton size="md" variant="solid-gold">
            <MessageCircle size={13} strokeWidth={2} />
            Message us now
          </LuxuryButton>
        </a>
        <LuxuryButton size="md" variant="outline" onClick={onClose}>
          Close
        </LuxuryButton>
      </div>
    </div>
  );
}

// =====================================================================
// Field + Stepper primitives
// =====================================================================
function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-eyebrow-muted flex items-center gap-2 mb-3">
        {icon && <span className="text-foreground/50">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function StepperField({
  label,
  icon,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-eyebrow-muted flex items-center gap-2 mb-3">
        <span className="text-foreground/50">{icon}</span>
        {label}
      </label>
      <div className="flex items-center h-11 border border-foreground/10 rounded-sm">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-11 h-full flex items-center justify-center text-foreground/60 hover:text-foreground disabled:opacity-30 transition-colors"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
          }}
          className="flex-1 h-full bg-transparent text-center text-[14px] font-medium text-foreground focus:outline-none border-x border-foreground/10"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-11 h-full flex items-center justify-center text-foreground/60 hover:text-foreground disabled:opacity-30 transition-colors"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
