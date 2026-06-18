"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Check, MapPin, Calendar, Clock,
  Users, Briefcase, Phone, Mail, User, MessageCircle,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useBookingStore } from "@/stores/booking-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { CATEGORY_META, VEHICLE_CATEGORIES, type VehicleCategory } from "@/lib/dto/lead.dto";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface FormState {
  pickup: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  vehicleCategory: VehicleCategory;
  vehicleId: string | null;
  passengers: number;
  luggage: number;
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

  const onOpenChange = (v: boolean) => {
    if (!v) {
      closeModal();
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
    if (step === 1) return form.passengers >= 1 && form.luggage >= 0;
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
      <DialogContent
        showCloseButton={false}
        className="max-w-[680px] w-[calc(100%-2rem)] p-0 gap-0 bg-card border-foreground/[0.12] rounded-md overflow-hidden shadow-[0_40px_100px_-30px_rgba(26,22,18,0.5)] max-h-[92svh] flex flex-col"
      >
        <VisuallyHidden>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            Submit your chauffeur request — we&apos;ll respond via WhatsApp within minutes.
          </DialogDescription>
        </VisuallyHidden>

        {/* Header — fixed at top */}
        <div className="relative px-6 sm:px-9 pt-8 pb-6 border-b border-foreground/[0.10] bg-gradient-to-br from-card via-card to-[#b08842]/[0.05] flex-shrink-0">
          {/* Gold gradient accent */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-48 h-48 opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 100% 0%, rgba(176, 136, 66, 0.22) 0%, transparent 60%)",
            }}
          />

          {/* Custom close button — single, prominent */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center text-foreground/65 hover:text-foreground hover:bg-foreground/[0.08] rounded-sm transition-all duration-200"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <p className="text-eyebrow mb-3 relative flex items-center gap-3">
            <span className="w-7 h-px bg-[#b08842]" />
            Request a Quote
          </p>
          <h2 className="text-[24px] sm:text-[26px] font-semibold text-foreground tracking-tight relative pr-10">
            {submittedRef ? "Request received" : "Tell us about your journey"}
          </h2>
          {!submittedRef && (
            <p className="text-[14px] text-foreground/70 mt-3 font-normal relative">
              No payment required. We respond via WhatsApp within minutes.
            </p>
          )}
        </div>

        {/* Body — scrollable, contains step content OR success state */}
        <div className="flex-1 overflow-y-auto">
          {submittedRef ? (
            <SuccessState reference={submittedRef} onClose={() => onOpenChange(false)} />
          ) : (
            <>
              {/* Step indicator — non-scrolling */}
              <div className="px-6 sm:px-9 py-5 border-b border-foreground/[0.10] bg-[#fffdf8] flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none min-w-0"
                  >
                    <div
                      className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all duration-300 ${
                        i < step
                          ? "bg-gradient-to-br from-[#d4b876] to-[#b08842] text-[#1a1612]"
                          : i === step
                            ? "bg-[#1a1612] text-[#f6f1e9]"
                            : "border border-foreground/20 text-foreground/50"
                      }`}
                    >
                      {i < step ? <Check size={11} strokeWidth={2.5} /> : i + 1}
                    </div>
                    <span
                      className={`hidden sm:inline text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 font-semibold ${
                        i === step ? "text-foreground" : "text-foreground/45"
                      }`}
                    >
                      {label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px bg-foreground/[0.10] min-w-[8px]" />
                    )}
                  </div>
                ))}
              </div>

              {/* Step body — scrollable if needed */}
              <div className="px-6 sm:px-9 py-7 sm:py-9 min-h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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
                    {step === 3 && (
                      <StepReview
                        form={form}
                        preselectedVehicleName={preselectedVehicleName}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Footer — fixed at bottom (only when not submitted) */}
        {!submittedRef && (
          <div className="px-6 sm:px-9 py-5 border-t border-foreground/[0.10] bg-[#fffdf8] flex items-center justify-between gap-3 flex-shrink-0">
            {step > 0 ? (
              <LuxuryButton
                size="md"
                variant="ghost"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
              >
                <ArrowLeft size={14} strokeWidth={2} />
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
                <ArrowRight size={14} strokeWidth={2} />
              </LuxuryButton>
            ) : (
              <LuxuryButton
                size="md"
                variant="solid-gold"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Request"}
                {!submitting && <ArrowRight size={14} strokeWidth={2} />}
              </LuxuryButton>
            )}
          </div>
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
    <div className="space-y-5">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    <div className="space-y-5">
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
                className={`relative p-4 text-left rounded-sm border transition-all duration-300 overflow-hidden group ${
                  selected
                    ? "border-[#b08842] bg-[#b08842]/[0.08]"
                    : "border-foreground/[0.12] hover:border-foreground/30 bg-cream"
                }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                {selected && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gradient-to-br from-[#d4b876] to-[#b08842] flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-[#1a1612]" />
                  </span>
                )}
                <div
                  className={`text-[13px] font-semibold mb-1 transition-colors duration-300 ${
                    selected ? "text-[#b08842]" : "text-foreground"
                  }`}
                >
                  {meta.label}
                </div>
                <div className="text-[11px] text-foreground/55 font-normal leading-snug">
                  {meta.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {preselectedVehicleName && (
        <div className="px-4 py-3 rounded-sm border border-[#b08842]/30 bg-[#b08842]/[0.05]">
          <p className="text-[12px] text-foreground/75">
            <span className="text-[#b08842] font-semibold">Pre-selected:</span>{" "}
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
        <label className="text-eyebrow-muted block mb-3">
          Additional notes (optional)
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="e.g. child seat required, multiple stops, VIP protocol"
          rows={3}
          className="w-full px-4 py-3 bg-cream border border-foreground/[0.12] rounded-sm text-[14px] font-normal text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-[#b08842] focus:shadow-[0_0_0_3px_rgba(176,136,66,0.10)] transition-all duration-220 resize-none"
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
    <div className="space-y-5">
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
            className="amhar-input flex-shrink-0"
            style={{ width: "112px" }}
          >
            <option value="+966">🇸🇦 +966</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+973">🇧🇭 +973</option>
            <option value="+974">🇶🇦 +974</option>
            <option value="+965">🇰🇼 +965</option>
            <option value="+968">🇴🇲 +968</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+1">🇺🇸 +1</option>
          </select>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="50 315 2119"
            className="amhar-input flex-1 min-w-0"
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

      <div className="flex items-start gap-2.5 pt-2 text-[12px] text-foreground/60 leading-relaxed">
        <MessageCircle
          size={14}
          className="mt-0.5 flex-shrink-0 text-[#b08842]"
          strokeWidth={1.5}
        />
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
      <p className="text-[13px] text-foreground/65 mb-5 font-normal">
        Please review your request before submitting. You can step back to make changes.
      </p>
      <dl className="divide-y divide-foreground/[0.08] border-y border-foreground/[0.10]">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 gap-3 sm:gap-4 py-3.5">
            <dt className="text-[10px] tracking-[0.20em] uppercase text-foreground/50 pt-0.5 font-semibold">
              {r.label}
            </dt>
            <dd className="col-span-2 text-[13px] sm:text-[14px] text-foreground font-normal break-words">
              {r.value || <span className="text-foreground/40">—</span>}
            </dd>
          </div>
        ))}
      </dl>
      {form.notes && (
        <div className="mt-5 p-4 rounded-sm bg-foreground/[0.02] border border-foreground/[0.08]">
          <p className="text-[10px] tracking-[0.20em] uppercase text-foreground/50 mb-2 font-semibold">
            Notes
          </p>
          <p className="text-[13px] text-foreground/80 font-normal">{form.notes}</p>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// Success state
// =====================================================================
function SuccessState({
  reference,
  onClose,
}: {
  reference: string;
  onClose: () => void;
}) {
  return (
    <div className="px-6 sm:px-9 py-12 text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4b876] to-[#b08842] flex items-center justify-center mx-auto mb-7 shadow-[0_14px_40px_-12px_rgba(176,136,66,0.5)]"
      >
        <Check size={26} strokeWidth={2.5} className="text-[#1a1612]" />
      </motion.div>
      <h3 className="text-[24px] font-semibold text-foreground mb-4 tracking-tight">
        Your request is in.
      </h3>
      <p className="text-[14px] text-foreground/70 font-normal max-w-sm mx-auto mb-3 leading-relaxed">
        Our concierge team will contact you on WhatsApp within minutes to confirm
        details and provide a tailored quote.
      </p>
      <p className="text-[11px] tracking-[0.22em] uppercase text-foreground/45 mb-8 font-semibold">
        Reference: <span className="text-[#b08842]">{reference}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={`https://wa.me/966503152119`} target="_blank" rel="noreferrer">
          <LuxuryButton size="md" variant="solid-gold">
            <MessageCircle size={14} strokeWidth={2} />
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
        {icon && <span className="text-foreground/70">{icon}</span>}
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
        <span className="text-foreground/70">{icon}</span>
        {label}
      </label>
      <div className="flex items-center h-14 border border-foreground/[0.15] rounded-sm bg-cream hover:border-[#b08842]/40 hover:shadow-[0_4px_16px_-4px_rgba(176,136,66,0.15)] transition-all duration-300">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-12 h-full flex items-center justify-center text-foreground/65 hover:text-[#b08842] hover:bg-[#b08842]/[0.06] disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-foreground/65 transition-all duration-200 text-[22px] font-light"
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
          className="amhar-stepper-input flex-1 w-full min-w-0 h-full bg-transparent text-center text-[22px] font-semibold text-foreground focus:outline-none border-x border-foreground/[0.12] tabular-nums"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-12 h-full flex items-center justify-center text-foreground/65 hover:text-[#b08842] hover:bg-[#b08842]/[0.06] disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-foreground/65 transition-all duration-200 text-[22px] font-light"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
