"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/use-magnetic";

/**
 * AMHAR Luxury Button v2 — polished with gold sheen.
 * Variants:
 *  - solid-gold : champagne gold background, deep espresso text — primary CTA
 *  - solid-dark  : deep espresso background, ivory text — high-contrast CTA (for light sections)
 *  - solid-light : ivory background, deep espresso text — high-contrast CTA (for dark sections)
 *  - outline     : 1px hairline border, transparent — secondary CTA
 *  - ghost       : no border, subtle hover — tertiary CTA
 */
const luxuryButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden",
  {
    variants: {
      variant: {
        "solid-gold":
          "bg-gradient-to-br from-[#d4b876] to-[#b08842] text-[#1a1612] hover:from-[#e0c982] hover:to-[#c9a961] hover:shadow-[0_14px_40px_-12px_rgba(176,136,66,0.55)] active:scale-[0.98] sheen-gold",
        "solid-dark":
          "bg-[#1a1612] text-[#f6f1e9] hover:bg-[#2a231b] hover:shadow-[0_14px_40px_-12px_rgba(26,22,18,0.4)] active:scale-[0.98]",
        "solid-light":
          "bg-[#f6f1e9] text-[#1a1612] hover:bg-white hover:shadow-[0_14px_40px_-12px_rgba(255,255,255,0.3)] active:scale-[0.98]",
        outline:
          "border border-foreground/30 text-foreground hover:border-[#b08842] hover:text-[#b08842] hover:bg-foreground/[0.03] active:scale-[0.98]",
        ghost:
          "text-foreground/75 hover:text-foreground hover:bg-foreground/[0.05] active:scale-[0.98]",
      },
      size: {
        sm: "h-10 px-5 text-[11px] uppercase tracking-[0.20em] rounded-sm",
        md: "h-12 px-8 text-[12px] uppercase tracking-[0.20em] rounded-sm",
        lg: "h-14 px-11 text-[13px] uppercase tracking-[0.24em] rounded-sm",
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
  magnetic?: boolean;
}

export const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant, size, magnetic, ...props }, forwardedRef) => {
    const magneticRef = useMagnetic<HTMLButtonElement>(
      typeof magnetic === "boolean" ? (magnetic ? 0.25 : 0) : size === "lg" ? 0.25 : 0,
    );

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
