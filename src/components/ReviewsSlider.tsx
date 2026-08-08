"use client";

import ArrowCarousel from "./ArrowCarousel";

type Review = {
  id: string;
  authorName: string;
  text: string;
  rating: number;
  imageUrl?: string | null;
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
  if (reviews.length === 0) return null;

  return (
    <ArrowCarousel item="basis-[86%] sm:basis-[46%] md:basis-[31%]">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm"
        >
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full bg-brand-cream">
            {r.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.imageUrl} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <Stars n={r.rating} />
          <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-navy-light">{r.text}</p>
          <p className="mt-4 text-sm font-bold text-brand-navy">{r.authorName}</p>
        </div>
      ))}
    </ArrowCarousel>
  );
}
