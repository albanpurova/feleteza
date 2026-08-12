"use client";

import { useState } from "react";

type Img = { url: string; alt: string | null };
type Vid = { id: string; url: string; thumbnail?: string | null; title?: string | null };

type Media =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; url: string; poster: string | null };

export default function ProductGallery({
  images,
  videos = [],
  name,
}: {
  images: Img[];
  videos?: Vid[];
  name: string;
}) {
  const media: Media[] = [
    ...images.map((im) => ({ type: "image" as const, url: im.url, alt: im.alt || name })),
    ...videos.map((v) => ({ type: "video" as const, url: v.url, poster: v.thumbnail ?? null })),
  ];
  const [active, setActive] = useState(0);
  const main = media[active];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-brand-cream p-6">
        {!main ? (
          <div className="flex h-full items-center justify-center text-brand-gray">Imazhi i produktit</div>
        ) : main.type === "video" ? (
          <video
            key={active}
            src={main.url}
            poster={main.poster || undefined}
            controls
            autoPlay
            playsInline
            style={{ accentColor: "#1f9d63" }}
            className="h-full w-full rounded-xl bg-black object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={main.url} alt={main.alt} className="h-full w-full object-contain" />
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {media.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-brand-cream p-2 ${
                i === active ? "ring-2 ring-brand-orange" : "ring-1 ring-black/5"
              }`}
            >
              {m.type === "video" ? (
                <>
                  {m.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.poster} alt="" className="h-full w-full rounded object-cover" />
                  ) : (
                    <video src={`${m.url}#t=0.1`} muted playsInline preload="metadata" className="h-full w-full rounded object-cover" />
                  )}
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-green text-white shadow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.alt} className="h-full w-full object-contain" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
