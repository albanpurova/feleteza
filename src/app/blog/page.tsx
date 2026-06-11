import Link from "next/link";
import { getBlogPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="container-x py-14">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Blog</h1>
      <p className="mt-2 text-brand-gray">Këshilla dhe artikuj rreth zhvillimit të hershëm të fëmijëve.</p>

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group mt-10 grid gap-6 overflow-hidden rounded-2xl md:grid-cols-2">
          <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-brand-cream">
            {featured.coverImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={featured.coverImage} alt={featured.title} className="h-full w-full object-cover transition group-hover:scale-105" />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-2xl font-bold text-brand-green group-hover:underline">{featured.title}</h2>
            {featured.excerpt && <p className="mt-3 text-brand-navy-light">{featured.excerpt}</p>}
            <span className="mt-4 text-sm font-semibold text-brand-orange">Lexo më shumë →</span>
          </div>
        </Link>
      )}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-brand-cream">
              {post.coverImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              )}
            </div>
            <h3 className="mt-3 font-bold leading-snug text-brand-green group-hover:underline">{post.title}</h3>
            {post.excerpt && <p className="mt-1 text-sm text-brand-gray line-clamp-2">{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
