"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MediaItem = { id: string; url: string; poster?: string | null };

export function isVideo(url: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
}

export default function MediaGallery({
  items,
  columns = "grid-cols-2 lg:grid-cols-4",
  aspect = "aspect-square",
  carousel = false,
  itemBasis = "basis-[47%] sm:basis-[31%] lg:basis-[23%]",
}: {
  items: MediaItem[];
  columns?: string;
  aspect?: string;
  carousel?: boolean;
  itemBasis?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  function scrollByDir(dir: number) {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: el.clientWidth * 0.8 * dir, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  const current = open !== null ? items[open] : null;

  const thumbs = items.map((m, i) => (
    <button
      key={m.id}
      type="button"
      onClick={() => setOpen(i)}
      className={`group relative ${aspect} overflow-hidden rounded-2xl bg-brand-cream ${
        carousel ? `shrink-0 snap-start ${itemBasis}` : ""
      }`}
    >
      {isVideo(m.url) ? (
        <>
          {m.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.poster} alt="" className="h-full w-full object-cover" />
          ) : (
            <video src={`${m.url}#t=0.1`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
          )}
          <span className="absolute inset-0 grid place-items-center bg-black/10 transition group-hover:bg-black/20">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-green text-white shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.poster || m.url} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
      )}
    </button>
  ));

  return (
    <>
      {carousel ? (
        <div className="relative">
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              aria-label="Prapa"
              className="absolute left-0 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-brand-navy shadow transition hover:bg-white sm:-left-3"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div ref={scrollRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1">
            {thumbs}
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              aria-label="Para"
              className="absolute right-0 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-brand-navy shadow transition hover:bg-white sm:-right-3"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 ${columns}`}>{thumbs}</div>
      )}

      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Mbyll"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-navy hover:bg-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Prapa"
              className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-brand-green text-white shadow-lg transition hover:bg-brand-green-dark sm:left-6"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <div className="max-h-[85vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {isVideo(current.url) ? (
              <video
                key={current.id}
                src={current.url}
                controls
                autoPlay
                playsInline
                style={{ accentColor: "#1f9d63" }}
                className="max-h-[85vh] w-full rounded-2xl bg-black"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.url} alt="" className="max-h-[85vh] w-full rounded-2xl object-contain" />
            )}
          </div>

          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Para"
              className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-brand-green text-white shadow-lg transition hover:bg-brand-green-dark sm:right-6"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
