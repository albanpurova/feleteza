import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import AddToCartControls from "@/components/AddToCartControls";
import FaqAccordion from "@/components/FaqAccordion";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";
import ArrowCarousel from "@/components/ArrowCarousel";
import { getProductBySlug, getAllProducts, getExperts, getMoments } from "@/lib/queries";
import { formatEuro } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return { title: p?.name ?? "Produkti" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [all, experts, moments] = await Promise.all([getAllProducts(), getExperts(), getMoments()]);
  const related = all.filter((p) => p.slug !== product.slug).slice(0, 2);

  return (
    <div className="bg-white">
      {/* KRYESORE */}
      <div className="container-x grid gap-10 py-12 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="font-display text-3xl font-extrabold text-brand-green">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold text-brand-navy">{formatEuro(product.price.toString())}</p>
          {product.shortDesc && <p className="mt-3 text-sm text-brand-gray">{product.shortDesc}</p>}

          <div className="mt-6">
            <AddToCartControls
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: parseFloat(product.price.toString()),
                image: product.images[0]?.url ?? null,
                freeShipping: product.freeShipping,
              }}
            />
          </div>

          {product.bullets.length > 0 && (
            <div className="mt-6 text-sm leading-relaxed text-brand-navy">
              <ul className="mt-3 space-y-1.5">
                {product.bullets.map((b) => (
                  <li key={b.id} className="flex gap-2">
                    <span className="text-brand-orange">•</span>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.ageRange && (
            <p className="mt-4 text-sm text-brand-gray">
              Rekomandohet për fëmijë: <strong className="text-brand-navy">{product.ageRange}</strong>
            </p>
          )}
        </div>
      </div>

      {/* PËRSHKRIMI */}
      {product.description && (
        <section className="container-x border-t border-black/5 py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-green">Përshkrimi i Produktit</h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center text-sm leading-relaxed text-brand-navy-light">
            {product.description.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* SEKSIONI A — BOXA (foto sipër, titull, përshkrim) */}
      {product.blocks.length > 0 && (
        <section className="container-x py-12">
          {product.blocksTitle && (
            <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold text-brand-green">
              {product.blocksTitle}
            </h2>
          )}
          <div className="mt-10">
            <Carousel desktop="sm:grid-cols-2 lg:grid-cols-3" item="basis-[85%] sm:basis-[48%]">
              {product.blocks.map((b) => (
                <div key={b.id} className="flex h-full flex-col">
                  <div className="mb-4 aspect-[3/2] w-full overflow-hidden rounded-2xl bg-brand-cream">
                    {b.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.imageUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <h3 className="font-bold text-brand-green">{b.title}</h3>
                  {b.body && (
                    <p className="mt-2 text-sm leading-relaxed text-brand-navy-light">{b.body}</p>
                  )}
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

{/* SEKSIONI B — FOTO E MADHE + LISTË ME PIKA */}
      {(product.highlightImage || product.highlightPoints) && (
        <section className="container-x py-12">
          {product.highlightTitle && (
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-brand-navy">
              {product.highlightTitle}
            </h2>
          )}
          <div className="grid items-center gap-8 md:grid-cols-[35fr_65fr]">
            <div>
              {product.highlightImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.highlightImage} alt="" className="w-full rounded-2xl object-cover" />
              )}
            </div>
            {product.highlightPoints && (
              <ul className="space-y-4">
                {product.highlightPoints
                  .split("\n")
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-brand-navy">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-green/15 text-brand-green">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* ÇKA MËSOJMË / KATEGORITË */}
      {product.features.length > 0 && (
        <section className="container-x py-12">
          <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold text-brand-navy">
            {product.featuresTitle || "Çka mësojmë nga kartat?"}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {product.features.map((f) => {
              // Nëse s'ka body, titulli ndahet në rreshta (ndarje me presje jashtë kllapave)
              const lines = f.body
                ? []
                : f.title.split(/,(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
              return (
                <div key={f.id} className="flex items-center gap-4">
                  <div
                    className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl p-2 sm:h-32 sm:w-32"
                  >
                    {f.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.imageUrl} alt="" className="h-full w-full rounded-xl object-contain" />
                    )}
                  </div>
                  <div className="text-sm leading-relaxed text-brand-navy-light">
                    {f.body ? (
                      <>
                        <h3 className="font-bold text-brand-navy">{f.title}</h3>
                        <p className="mt-1 whitespace-pre-line">{f.body}</p>
                      </>
                    ) : (
                      <ul className="space-y-1">
                        {lines.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* INFORMACION RRETH PRODUKTIT */}
      {product.infoCards.length > 0 && (
        <section className="container-x py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-green">Informacion rreth produktit</h2>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {product.infoCards.map((c) => (
              <div key={c.id} className="flex h-full flex-col rounded-2xl border border-black/5 bg-[#f3f4f6] p-4 text-center">
                {/* <p className="mb-3 text-sm font-semibold text-brand-navy">{c.label}</p> */}
                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt="" className="mx-auto mt-auto w-full object-contain" />
                ) : (
                  <div className="mx-auto mt-auto h-28 w-full rounded-lg bg-white/70" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EKSPERTË */}
      {experts.length > 0 && (
        <section className="container-x py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-navy">
            Të konceptuara dhe të zhvilluara nga ekspertë të edukimit të hershëm
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {experts.map((e) => (
              <div key={e.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white text-center shadow-sm">
                {e.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="aspect-[4/3] w-full bg-brand-cream" />
                )}
                <p className="py-3 text-sm font-bold text-brand-navy">{e.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MOMENTE */}
      {moments.length > 0 && (
        <section className="bg-brand-yellow py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-navy">Momente të ndara nga prindërit</h2>
          <div className="container-x mt-8">
            <ArrowCarousel
              item="basis-[60%] sm:basis-[30%] md:basis-[15.5%]"
              arrowClass="bg-white/80 shadow hover:bg-white"
            >
              {moments.map((m) => (
                <div key={m.id} className="aspect-[3/5] overflow-hidden rounded-xl bg-white/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </ArrowCarousel>
          </div>
        </section>
      )}

      {/* FAQ */}
      {product.faqs.length > 0 && (
        <section className="container-x py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-green">Pyetjet më të shpeshta</h2>
          <div className="mt-8">
            <FaqAccordion faqs={product.faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
          </div>
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="container-x py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-navy">Produkte që mund t&apos;ju pëlqejnë</h2>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                p={{ productId: p.id, slug: p.slug, name: p.name, price: p.price.toString(), image: p.images[0]?.url ?? null, freeShipping: p.freeShipping }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// E ndriçon pak ngjyrën e tagut për background të butë
function lighten(hex: string | null): string {
  if (!hex) return "#f4f7f6";
  if (hex === "#000000") return "#ececec";
  // shton transparencë 18%
  return hex.length === 7 ? `${hex}2e` : hex;
}