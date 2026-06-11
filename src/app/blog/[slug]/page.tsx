import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return { title: post?.title ?? "Artikulli" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post || !post.published) notFound();

  const others = (await getBlogPosts(3)).filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="bg-white">
      <div className="container-x max-w-3xl py-12">
        <Link href="/blog" className="text-sm font-semibold text-brand-orange">← Të gjitha artikujt</Link>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-brand-gray">
          {post.author} ·{" "}
          {new Date(post.publishedAt).toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {post.coverImage && (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-brand-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div
          className="prose mt-8 max-w-none text-brand-navy-light [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-navy [&_p]:mt-4 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {others.length > 0 && (
        <div className="container-x max-w-3xl border-t border-black/5 py-10">
          <h2 className="font-display text-xl font-bold text-brand-navy">Artikuj të tjerë</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {others.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-brand-cream">
                  {p.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <h3 className="mt-2 font-bold text-brand-green group-hover:underline">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
