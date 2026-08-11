import Link from "next/link";
import { getBlogPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog" };

function fmtDate(d: Date | string) {
  return new Date(d)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ (\d{4})$/, ", $1");
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      <div className="container-x py-12">
        <h1 className="mb-10 text-center font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">Blog</h1>
        {/* POSTIMI I FUNDIT — 100% gjerësi, foto 50% + tekst 50% */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm md:grid-cols-2"
          >
            <div className="aspect-[16/11] overflow-hidden bg-brand-cream">
              {featured.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.coverImage}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="text-sm text-brand-gray">{fmtDate(featured.publishedAt)}</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-brand-green group-hover:underline">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mt-3 text-base leading-relaxed text-brand-navy-light line-clamp-3">
                  {featured.excerpt}
                </p>
              )}
            </div>
          </Link>
        )}

        {/* Ndarës */}
        <div className="mx-auto my-12 h-1 w-24 rounded bg-brand-teal/40" />

        {/* TË TJERAT — listë 2 kolonash (50%), karta horizontale */}
        <div className="grid gap-6 sm:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-5 rounded-xl border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="h-32 w-44 shrink-0 overflow-hidden rounded-xl bg-brand-cream sm:h-36 sm:w-48">
                {post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                )}
              </div>
              <div className="min-w-0 self-center">
                <span className="text-sm text-brand-gray">{fmtDate(post.publishedAt)}</span>
                <h3 className="mt-1 text-lg font-bold leading-snug text-brand-green group-hover:underline line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-brand-gray line-clamp-3">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
