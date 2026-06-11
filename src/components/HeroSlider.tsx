"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  slug: string;
  name: string;
  image: string | null;
  price: string;
};

export default function HeroSlider({
  title,
  subtitle,
  slides,
}: {
  title: string;
  subtitle: string;
  slides: Slide[];
}) {
  const [active, setActive] = useState(0);
  const hasSlides = slides.length > 0;

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = hasSlides ? slides[active] : null;

  return (
    <section className="bg-brand-cream">
      <div className="container-x grid items-center gap-8 py-12 md:grid-cols-2 md:py-16">
        {/* Teksti */}
        <div className="order-2 md:order-1">
          <h1 className="font-display text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl lg:text-[2.7rem]">
            {title.split("Fletëza").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-brand-orange">Fletëza</span>}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md text-brand-navy-light">{subtitle}</p>
          <Link
            href={current ? `/produkti/${current.slug}` : "/produktet"}
            className="btn-primary mt-7 uppercase tracking-wide"
          >
            Porosit tani
          </Link>

          {slides.length > 1 && (
            <div className="mt-8 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    i === active ? "w-8 bg-brand-orange" : "w-2.5 bg-brand-orange/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Imazhi i produktit */}
        <div className="order-1 flex justify-center md:order-2">
          <div className="relative aspect-square w-full max-w-md rounded-3xl bg-brand-cream-dark p-6">
            {current?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.image}
                alt={current.name}
                className="h-full w-full object-contain transition-opacity duration-500"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/60 text-brand-gray">
                Imazhi i produktit
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
