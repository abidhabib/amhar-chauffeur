"use client";

import {
  useEffect, useRef, useState, useSyncExternalStore, type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal — wraps children and fades+lifts them into view on scroll.
 * Restrained: 700ms ease-out, single direction (bottom-up), one-shot.
 *
 * @param delay ms — additional delay before reveal animation
 * @param as    semantic element to render as (default "div")
 */
interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  // If user prefers reduced motion, render in revealed state from the start.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return; // reveal handled below by conditional class
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => setRevealed(true), delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, prefersReducedMotion]);

  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      className={cn(
        // When reduced motion is preferred, skip the animation entirely.
        prefersReducedMotion
          ? "opacity-100"
          : cn("reveal-on-scroll", revealed && "is-revealed"),
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * usePrefersReducedMotion — subscribes to the user's motion preference
 * via useSyncExternalStore. Returns false during SSR (no hydration mismatch),
 * then the real value on the client.
 */
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
