import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | string) {
  return new Date(d)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ (\d{4})$/, ", $1");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return { title: post?.title ?? "Artikulli" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post || !post.published) notFound();

  const latest = (await getBlogPosts(6)).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="container-x py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        {/* PËRMBAJTJA */}
        <article className="lg:col-span-2">
          {post.coverImage && (
            <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-brand-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
            </div>
          )}

          <span className="mt-6 inline-block text-xs font-bold tracking-widest text-brand-green">BLOG</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-brand-gray">{fmtDate(post.publishedAt)}</p>

          <div
            className="prose mt-6 max-w-none text-brand-navy-light [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-navy [&_h3]:mt-6 [&_h3]:font-bold [&_h3]:text-brand-navy [&_li]:mt-1 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <Link href="/blog" className="mt-10 inline-block text-sm font-semibold text-brand-orange">
            ← Të gjitha artikujt
          </Link>
        </article>

        {/* SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <h2 className="border-b-2 border-brand-orange pb-2 font-display text-lg font-bold text-brand-navy">
              Artikujt e fundit
            </h2>
            <div className="mt-5 space-y-5">
              {latest.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group flex gap-3">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-brand-gray">{fmtDate(p.publishedAt)}</span>
                    <h3 className="text-sm font-bold leading-snug text-brand-green group-hover:underline line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
              {latest.length === 0 && <p className="text-sm text-brand-gray">S'ka artikuj të tjerë.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
