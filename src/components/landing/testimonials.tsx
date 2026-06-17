"use client";

import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

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
      className="py-32 lg:py-44 border-t border-foreground/[0.10]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="text-eyebrow mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#b08842]" />
              Client Voices
            </p>
            <h2 className="text-headline text-foreground mb-7">
              Trusted, repeatedly,
              <br />
              <span className="text-foreground/40">by those who travel often.</span>
            </h2>
          </div>

          {/* Aggregate rating */}
          <div className="flex items-center gap-4 px-6 py-5 rounded-sm border border-foreground/[0.12] bg-card">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={17}
                  className={
                    i < Math.round(average)
                      ? "fill-[#b08842] text-[#b08842]"
                      : "text-foreground/20"
                  }
                />
              ))}
            </div>
            <div className="text-[15px] text-foreground/80 font-medium">
              <span className="font-bold text-foreground text-[18px]">{average.toFixed(1)}</span>
              <span className="text-foreground/55"> · {count} reviews</span>
            </div>
          </div>
        </Reveal>

        {reviews.length === 0 ? (
          <div className="py-16 text-center text-foreground/50 text-[15px]">
            Client testimonials will appear here once approved.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((r, i) => (
              <Reveal
                key={r.id}
                delay={Math.min(i * 80, 400)}
                className="surface-luxury p-8 flex flex-col gap-5 group"
              >
                <div className="flex items-center justify-between">
                  <Quote size={26} className="text-[#b08842]" strokeWidth={1.5} />
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        size={11}
                        className={
                          si < r.rating
                            ? "fill-[#b08842] text-[#b08842]"
                            : "text-foreground/20"
                        }
                      />
                    ))}
                  </div>
                </div>
                <blockquote className="text-[15px] leading-relaxed text-foreground/85 font-normal flex-1">
                  {r.body}
                </blockquote>
                <figcaption className="pt-5 border-t border-foreground/[0.10]">
                  <div className="text-[14px] font-semibold text-foreground">
                    {r.clientName}
                  </div>
                  {r.clientTitle && (
                    <div className="text-[12px] text-foreground/55 mt-1 font-medium">
                      {r.clientTitle}
                    </div>
                  )}
                </figcaption>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
