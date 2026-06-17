
---
Task ID: polish-1
Agent: main
Task: Fix booking modal stepper number visibility, improve text contrast across the site, and add restrained interactivity (parallax, magnetic CTAs, cursor glow, scroll-spy, reveal-on-scroll).

Work Log:
- Lifted foreground luminance 0.96 → 0.99 (near-pure white) in dark theme
- Lifted muted-foreground 0.62 → 0.72 for readable body text
- Lifted border opacity 0.08 → 0.10 for clearer separation
- Added new --gold-bright token (#e0c982) and lifted --silver to #c8c8c8
- Eyebrow text now uses font-weight 600 + gold-bright color for stronger presence
- Body text bumped from font-weight 300 → 400 across .text-body-lg
- Stepper numbers: 14px → 20px, font-medium, tabular-nums, with proper -webkit-appearance: none to hide spin buttons; container grew from h-11 → h-14 with bg-foreground/[0.02]
- Vehicle category cards: added selected checkmark badge, gold accent on selection, hover bg
- Modal header: added subtle gold radial gradient accent in top-right
- All input fields: added 2% background tint, lifted placeholder color to 38% foreground
- Created useMagnetic hook (cursor-follow effect on primary CTAs)
- Created CursorGlow component (luxury gold radial glow trailing cursor on desktop)
- Created Reveal component (scroll-reveal using IntersectionObserver, respects prefers-reduced-motion via useSyncExternalStore)
- Upgraded LuxuryButton: magnetic prop, hover shadows, active:scale-[0.98]
- Hero: added parallax on bg image (drifts slower) + content fade on scroll, magnetic CTAs, animated scroll cue
- Nav: added scroll-spy (active section underline in gold), lifted text contrast, magnetic CTA
- Services: Reveal wrappers, gold-underline "Request this service" link, group hover icon transitions
- Fleet: Reveal wrappers, hover overlay with "Request this vehicle" gold button, image zoom + gradient overlay
- HowItWorks: Reveal with staggered delays, gold number scales on group hover, gold connector line
- Testimonials: Reveal, surface-luxury cards, per-card star ratings, lifted text contrast
- Footer: Reveal, gold radial bg on final CTA, lifted text contrast on all links

Stage Summary:
- Lint: clean (0 errors)
- Browser-verified: stepper numbers visible (20px, weight 500, white), scroll-spy working (Fleet link shows 45px gold underline when fleet section in view), cursor-glow element present, modal header has gold gradient accent, all sections reveal on scroll
- Design feels significantly more premium: text is crisp, hover states are tactile, motion is restrained but present
