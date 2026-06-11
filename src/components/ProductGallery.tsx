"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: { url: string; alt: string | null }[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-brand-cream p-6">
        {main ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={main.url} alt={main.alt || name} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-gray">Imazhi i produktit</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-lg bg-brand-cream p-2 ${
                i === active ? "ring-2 ring-brand-orange" : "ring-1 ring-black/5"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || ""} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
