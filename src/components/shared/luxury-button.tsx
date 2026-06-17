"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/use-magnetic";

/**
 * AMHAR Luxury Button — restrained, premium.
 * Variants:
 *  - solid-gold : gold background, near-black text — primary CTA
 *  - solid-light: white background, near-black text — high-contrast CTA
 *  - outline    : 1px hairline border, transparent — secondary CTA
 *  - ghost      : no border, subtle hover — tertiary CTA
 *
 * Optional `magnetic` prop enables subtle cursor-tracking on desktop only.
 */
const luxuryButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden",
  {
    variants: {
      variant: {
        "solid-gold":
          "bg-[#c9a961] text-[#0a0a0b] hover:bg-[#d4b876] hover:shadow-[0_12px_40px_-12px_rgba(201,169,97,0.6)] active:scale-[0.98]",
        "solid-light":
          "bg-foreground text-background hover:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.25)] active:scale-[0.98]",
        outline:
          "border border-foreground/25 text-foreground hover:border-[#c9a961] hover:text-[#c9a961] hover:bg-foreground/[0.03] active:scale-[0.98]",
        ghost:
          "text-foreground/75 hover:text-foreground hover:bg-foreground/[0.05] active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-[11px] uppercase tracking-[0.18em] rounded-sm",
        md: "h-11 px-7 text-[12px] uppercase tracking-[0.18em] rounded-sm",
        lg: "h-14 px-10 text-[13px] uppercase tracking-[0.22em] rounded-sm",
      },
    },
    defaultVariants: {
      variant: "solid-gold",
      size: "md",
    },
  },
);

export interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof luxuryButtonVariants> {
  /** Enable subtle magnetic cursor-follow on desktop pointers (default: true for lg size) */
  magnetic?: boolean;
}

export const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant, size, magnetic, ...props }, forwardedRef) => {
    const magneticRef = useMagnetic<HTMLButtonElement>(
      typeof magnetic === "boolean" ? (magnetic ? 0.25 : 0) : size === "lg" ? 0.25 : 0,
    );

    // Merge refs — caller's ref and our magnetic ref
    const setRef = (el: HTMLButtonElement | null) => {
      magneticRef.current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    return (
      <button
        ref={setRef}
        className={cn(luxuryButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
LuxuryButton.displayName = "LuxuryButton";
