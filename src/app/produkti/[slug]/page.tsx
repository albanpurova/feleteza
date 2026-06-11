import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import AddToCartControls from "@/components/AddToCartControls";
import FaqAccordion from "@/components/FaqAccordion";
import ProductCard from "@/components/ProductCard";
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

      {/* ÇKA MËSOJMË / KATEGORITË */}
      {product.features.length > 0 && (
        <section className="container-x py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-navy">Çka mësojmë nga kartat?</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl p-5"
                style={{ background: lighten(f.colorTag) }}
              >
                <h3 className="font-bold text-brand-navy">{f.title}</h3>
                {f.body && <p className="mt-2 text-sm text-brand-navy-light">{f.body}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INFORMACION RRETH PRODUKTIT */}
      {product.infoCards.length > 0 && (
        <section className="container-x py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-green">Informacion rreth produktit</h2>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {product.infoCards.map((c) => (
              <div key={c.id} className="rounded-2xl border border-black/5 bg-brand-cream p-6 text-center">
                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt={c.label} className="mx-auto mb-3 h-24 object-contain" />
                ) : (
                  <div className="mx-auto mb-3 h-24 w-full rounded-lg bg-white/50" />
                )}
                <p className="text-sm font-semibold text-brand-navy">{c.label}</p>
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
                  <img src={e.imageUrl} alt={e.label} className="aspect-[4/3] w-full object-cover" />
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
        <section className="py-12">
          <h2 className="text-center font-display text-2xl font-bold text-brand-navy">Momente të ndara nga prindërit</h2>
          <div className="mt-8 bg-brand-yellow py-8">
            <div className="container-x grid grid-cols-3 gap-4 md:grid-cols-6">
              {moments.map((m) => (
                <div key={m.id} className="aspect-[3/5] overflow-hidden rounded-xl bg-white/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.imageUrl} alt="Moment" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
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
                p={{ slug: p.slug, name: p.name, price: p.price.toString(), image: p.images[0]?.url ?? null }}
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
