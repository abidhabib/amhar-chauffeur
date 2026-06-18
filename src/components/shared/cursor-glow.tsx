"use client";

import { useEffect, useRef } from "react";

/**
 * CursorGlow — a luxury gold radial glow that trails the cursor on desktop.
 * Disabled on touch devices via CSS media query.
 * Mounted once at the app root.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip on touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let rafId: number | null = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      el.classList.add("is-active");
      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      // Lerp for smooth trailing
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      el.style.left = `${currentX}px`;
      el.style.top = `${currentY}px`;
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    };

    const onLeave = () => el.classList.remove("is-active");

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden />;
}
