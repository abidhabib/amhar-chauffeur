"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Review {
  id: string;
  clientName: string;
  clientTitle: string | null;
  rating: number;
  body: string;
  source: string;
  createdAt: string;
}

interface Props {
  reviews: Review[];
  average: number;
  count: number;
}

export function Testimonials({ reviews, average, count }: Props) {
  return (
    <section
      id="testimonials"
      className="py-32 lg:py-40 border-t border-foreground/[0.06]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="text-eyebrow mb-6">Client Voices</p>
            <h2 className="text-headline text-foreground mb-6">
              Trusted, repeatedly,
              <br />
              <span className="text-foreground/40">by those who travel often.</span>
            </h2>
          </div>

          {/* Aggregate rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(average)
                      ? "fill-[#c9a961] text-[#c9a961]"
                      : "text-foreground/20"
                  }
                />
              ))}
            </div>
            <div className="text-[14px] text-foreground/70">
              <span className="font-medium text-foreground">{average.toFixed(1)}</span>
              <span className="text-foreground/40"> · {count} reviews</span>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="py-16 text-center text-foreground/40 text-[14px]">
            Client testimonials will appear here once approved.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((r, i) => (
              <motion.figure
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="surface-luxury p-7 flex flex-col gap-5"
              >
                <Quote size={20} className="text-[#c9a961]" strokeWidth={1.5} />
                <blockquote className="text-[14px] leading-relaxed text-foreground/75 font-light flex-1">
                  {r.body}
                </blockquote>
                <figcaption className="pt-5 border-t border-foreground/[0.06]">
                  <div className="text-[13px] font-medium text-foreground">
                    {r.clientName}
                  </div>
                  {r.clientTitle && (
                    <div className="text-[11px] text-foreground/45 mt-0.5">
                      {r.clientTitle}
                    </div>
                  )}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
