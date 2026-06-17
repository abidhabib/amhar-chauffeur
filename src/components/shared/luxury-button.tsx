"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * AMHAR Luxury Button — restrained, premium.
 * Variants:
 *  - solid-gold : gold background, near-black text — primary CTA
 *  - solid-light: white background, near-black text — high-contrast CTA
 *  - outline    : 1px hairline border, transparent — secondary CTA
 *  - ghost      : no border, subtle hover — tertiary CTA
 */
const luxuryButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed select-none",
  {
    variants: {
      variant: {
        "solid-gold":
          "bg-[#c9a961] text-[#0a0a0b] hover:bg-[#d4b876] hover:shadow-[0_8px_30px_-8px_rgba(201,169,97,0.5)]",
        "solid-light":
          "bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_8px_30px_-8px_rgba(255,255,255,0.2)]",
        outline:
          "border border-foreground/20 text-foreground hover:border-foreground/50 hover:bg-foreground/[0.04]",
        ghost:
          "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]",
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
    VariantProps<typeof luxuryButtonVariants> {}

export const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(luxuryButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
LuxuryButton.displayName = "LuxuryButton";
