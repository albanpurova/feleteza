"use client";

import { useState } from "react";

type Review = {
  id: string;
  authorName: string;
  text: string;
  rating: number;
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex justify-center gap-1 text-brand-yellow">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const [start, setStart] = useState(0);
  if (reviews.length === 0) return null;

  const visible = [
    reviews[start % reviews.length],
    reviews[(start + 1) % reviews.length],
    reviews[(start + 2) % reviews.length],
  ].filter(Boolean) as Review[];

  return (
    <div className="relative">
      <div className="grid gap-6 md:grid-cols-3">
        {visible.map((r, idx) => (
          <div
            key={`${r.id}-${idx}`}
            className={`rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm ${
              idx === 1 ? "md:scale-105" : "opacity-90"
            }`}
          >
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-brand-cream" />
            <Stars n={r.rating} />
            <p className="mt-4 text-sm leading-relaxed text-brand-navy-light">{r.text}</p>
            <p className="mt-4 text-sm font-bold text-brand-navy">{r.authorName}</p>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <>
          <button
            onClick={() => setStart((s) => (s - 1 + reviews.length) % reviews.length)}
            className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow md:block"
            aria-label="Më parë"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => setStart((s) => (s + 1) % reviews.length)}
            className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow md:block"
            aria-label="Më pas"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M9 6l6 6-6 6" /></svg>
          </button>
        </>
      )}
    </div>
  );
}
