"use client";

import { Children, useRef } from "react";

/**
 * Carousel horizontal me shigjeta anash.
 * item = gjerësia e çdo slajdi (basis), p.sh. "basis-full md:basis-[31%]"
 * arrowClass = stil shtesë për butonat e shigjetave (p.sh. sfond i bardhë mbi të verdhë)
 */
export default function ArrowCarousel({
  children,
  item,
  arrowClass = "",
  className = "",
}: {
  children: React.ReactNode;
  item: string;
  arrowClass?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  function scroll(dir: number) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.85 * dir, behavior: "smooth" });
  }

  const arrowBase =
    "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-brand-navy transition";

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Prapa"
        className={`${arrowBase} left-0 sm:-left-2 ${arrowClass}`}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-10"
      >
        {items.map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${item}`}>
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Para"
        className={`${arrowBase} right-0 sm:-right-2 ${arrowClass}`}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
