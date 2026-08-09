"use client";

import { useState } from "react";

type Review = {
  id: string;
  authorName: string;
  text: string;
  rating: number;
  imageUrl?: string | null;
};

function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <div className="flex justify-center gap-1 text-brand-yellow">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9z" />
        </svg>
      ))}
    </div>
  );
}

function Photo({ url, className }: { url?: string | null; className: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-brand-cream ${className}`}>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-full w-full object-cover" />
      )}
    </div>
  );
}

function BigCard({ r }: { r: Review }) {
  return (
    <div>
      <Photo url={r.imageUrl} className="aspect-[4/3] w-full" />
      <div className="mt-4 text-center">
        <Stars n={r.rating} size={18} />
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-green">{r.text}</p>
        <p className="mt-3 text-sm font-semibold text-brand-navy">{r.authorName}</p>
      </div>
    </div>
  );
}

function SmallCard({ r }: { r: Review }) {
  return (
    <div className="opacity-90">
      <Photo url={r.imageUrl} className="aspect-[4/3] w-full" />
      <div className="mt-3 text-center">
        <Stars n={r.rating} size={13} />
        <p className="mx-auto mt-2 max-w-[16rem] text-xs leading-relaxed text-brand-gray line-clamp-4">{r.text}</p>
        <p className="mt-2 text-xs font-medium text-brand-gray">{r.authorName}</p>
      </div>
    </div>
  );
}

function Arrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Prapa" : "Para"}
      className={`absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-brand-navy/50 transition hover:text-brand-navy ${
        dir === "left" ? "left-0" : "right-0"
      }`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}

export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const n = reviews.length;
  if (n === 0) return null;

  const at = (i: number) => reviews[((i % n) + n) % n];
  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);

  const center = at(index);
  const showSides = n >= 3;
  const showRight = n >= 2;

  return (
    <div className="relative px-10 sm:px-14">
      {n > 1 && <Arrow dir="left" onClick={prev} />}
      {n > 1 && <Arrow dir="right" onClick={next} />}

      {/* MOBILE: vetëm boxi qendror */}
      <div className="md:hidden">
        <BigCard r={center} />
      </div>

      {/* DESKTOP: 3 boxa, ai i mesit më i madh */}
      <div className="hidden items-center justify-center gap-6 md:flex">
        {showSides && (
          <div className="w-1/4">
            <SmallCard r={at(index - 1)} />
          </div>
        )}
        <div className="w-2/5">
          <BigCard r={center} />
        </div>
        {showRight && (
          <div className="w-1/4">
            <SmallCard r={at(index + 1)} />
          </div>
        )}
      </div>
    </div>
  );
}