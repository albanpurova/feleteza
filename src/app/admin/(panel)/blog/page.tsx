import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost } from "@/app/admin/actions-content";

export const dynamic = "force-dynamic";

async function loadPosts() {
  try {
    return await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  } catch (e) {
    console.error("[admin] blog:", e);
    return null;
  }
}

export default async function AdminBlogPage() {
  const posts = await loadPosts();

  if (posts === null) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-4">Blogu</h1>
        <p className="text-brand-gray">Nuk u lidh dot me bazën e të dhënave.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-brand-navy">Blogu ({posts.length})</h1>
        <Link href="/admin/blog/new" className="btn-primary text-sm">
          + Shkrim i ri
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-black/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-brand-gray border-b border-black/5">
              <th className="px-5 py-3 font-medium">Titulli</th>
              <th className="px-5 py-3 font-medium">Data</th>
              <th className="px-5 py-3 font-medium text-center">Publikuar</th>
              <th className="px-5 py-3 font-medium text-right">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/blog/${p.id}`} className="font-medium text-brand-navy hover:text-brand-green">
                    {p.title}
                  </Link>
                  <div className="text-brand-gray text-xs">/{p.slug}</div>
                </td>
                <td className="px-5 py-3 text-brand-gray text-xs">
                  {new Date(p.publishedAt).toLocaleDateString("sq-AL")}
                </td>
                <td className="px-5 py-3 text-center">{p.published ? "✅" : "⬜"}</td>
                <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                  <Link href={`/admin/blog/${p.id}`} className="text-brand-green hover:underline">
                    Edito
                  </Link>
                  <form action={deleteBlogPost} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-brand-red hover:underline">
                      Fshi
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-brand-gray text-center">
                  Ende s'ka shkrime.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
