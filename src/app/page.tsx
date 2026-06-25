import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import ReviewsSlider from "@/components/ReviewsSlider";
import ProductCard from "@/components/ProductCard";
import {
  getFeaturedProducts,
  getSettingsMap,
  getHomeReasons,
  getExperts,
  getReviews,
  getMoments,
  getBlogPosts,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, settings, reasons, experts, reviews, moments, posts] = await Promise.all([
    getFeaturedProducts(),
    getSettingsMap(),
    getHomeReasons(),
    getExperts(),
    getReviews(),
    getMoments(),
    getBlogPosts(4),
  ]);

  const slides = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.images[0]?.url ?? null,
    price: p.price.toString(),
  }));

  return (
    <>
      {/* HERO */}
      <HeroSlider
        title={settings.hero_title || "Zbuloni botën me Fletëza – udhëtimi magjik i fëmijës suaj nis këtu"}
        subtitle={settings.hero_subtitle || "Me Fletëza, çdo moment është mundësi për lojë dhe mësim me fëmijën tuaj."}
        slides={slides}
      />

      {/* 3 PRODUKTET */}
      <section className="container-x py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((p) => (
            <ProductCard
              key={p.id}
              p={{ productId: p.id, slug: p.slug, name: p.name, price: p.price.toString(), image: p.images[0]?.url ?? null, freeShipping: p.freeShipping }}
            />
          ))}
        </div>
      </section>

      {/* PSE FLETËZA */}
      <section id="pse-fleteza" className="relative overflow-hidden bg-white py-16">
        <h2 className="text-center font-display text-3xl font-extrabold text-brand-green">
          Pse FLETËZA?
        </h2>
        <div className="container-x mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, index) => (
          <div
            key={r.id}
            className={`rounded-2xl ${
              index === 1 || index === 4 ? "-mt-30" : ""
            }`}
          >
            {r.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.imageUrl}
                alt=""
                className="mb-4 aspect-[4/3] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="mb-4 aspect-[4/3] w-full rounded-2xl bg-brand-cream" />
            )}

            <h3 className="font-display text-lg font-bold text-brand-green">
              {r.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-navy-light">
              {r.body}
            </p>
          </div>
        ))}
        </div>
      </section>

      {/* EKSPERTË */}
      <section className="container-x py-12">
        <h2 className="text-center font-display text-2xl font-extrabold text-brand-navy sm:text-3xl">
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

      {/* REVIEWS */}
      <section id="reviews" className="container-x py-14">
        <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-extrabold text-brand-navy sm:text-3xl">
          {settings.reviews_heading || "Mbi 5000 prindër dhe profesionistë kanë zgjedhur produktet tona"}
        </h2>
        <div className="mt-10">
          <ReviewsSlider reviews={reviews.map((r) => ({ id: r.id, authorName: r.authorName, text: r.text, rating: r.rating }))} />
        </div>
      </section>

      {/* MISIONI */}
      <section className="bg-brand-red">
        <div className="container-x grid items-center gap-8 py-12 md:grid-cols-2">
          <p className="text-lg font-semibold leading-relaxed text-white">
            {settings.mission_text ||
              "Misioni ynë është që të fëmijët të brumosim dashurinë për mendimin kritik dhe të mësuarit përmes materialeve kreative, argëtuese dhe tërheqëse."}
          </p>
          <div className="w-full rounded-2xl bg-white/20">
          <Image
            src="/images/sf.png"
            alt="Misioni"
            width={640}
            height={360}
            className="h-full w-full object-cover"
          />
          </div>

        </div>
      </section>

      {/* MOMENTE */}
      <section className="py-14">
        <h2 className="text-center font-display text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Momente të ndara nga prindërit
        </h2>
        <div className="mt-8 bg-brand-yellow py-8">
          <div className="container-x grid grid-cols-3 gap-4 md:grid-cols-6">
            {moments.map((m) => (
              <div key={m.id} className="aspect-[3/5] overflow-hidden rounded-xl bg-white/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="container-x py-10">
        <h2 className="text-center font-display text-2xl font-extrabold text-brand-navy sm:text-3xl">Blog</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-brand-cream">
                {post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                )}
              </div>
              <h3 className="mt-3 text-sm font-bold leading-snug text-brand-green group-hover:underline">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
