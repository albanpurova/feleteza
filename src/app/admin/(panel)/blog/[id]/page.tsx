import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveBlogPost } from "@/app/admin/actions-content";
import ImageUploader from "@/components/ImageUploader";

export const dynamic = "force-dynamic";

export default async function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";

  let post = null;
  if (!isNew) {
    try {
      post = await prisma.blogPost.findUnique({ where: { id } });
    } catch (e) {
      console.error("[admin] blog edit:", e);
    }
    if (!post) notFound();
  }

  const inputCls = "input-field";
  const dateValue = post ? new Date(post.publishedAt).toISOString().slice(0, 10) : "";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="text-sm text-brand-green hover:underline">
          ← Blogu
        </Link>
        <h1 className="text-2xl font-display font-bold text-brand-navy">
          {isNew ? "Shkrim i ri" : "Edito shkrimin"}
        </h1>
      </div>

      <form action={saveBlogPost} className="bg-white rounded-xl border border-black/5 p-6 space-y-5">
        {!isNew && <input type="hidden" name="id" value={post!.id} />}

        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1">Titulli *</span>
          <input name="title" defaultValue={post?.title ?? ""} className={inputCls} required />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-semibold text-brand-navy mb-1">Slug</span>
            <input name="slug" defaultValue={post?.slug ?? ""} className={inputCls} />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-brand-navy mb-1">Autori</span>
            <input name="author" defaultValue={post?.author ?? "FLETËZA"} className={inputCls} />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1">Përmbledhje (excerpt)</span>
          <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} className={inputCls} rows={2} />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1">Imazhi kryesor (URL)</span>
          <input id="blog-cover" name="coverImage" defaultValue={post?.coverImage ?? ""} className={inputCls} />
          <ImageUploader targetId="blog-cover" mode="replace" />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1">Përmbajtja (HTML) *</span>
          <textarea
            name="content"
            defaultValue={post?.content ?? ""}
            className={`${inputCls} font-mono text-sm`}
            rows={14}
            required
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <label className="block">
            <span className="block text-sm font-semibold text-brand-navy mb-1">Data e publikimit</span>
            <input name="publishedAt" type="date" defaultValue={dateValue} className={inputCls} />
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-navy pb-2">
            <input type="checkbox" name="published" defaultChecked={post ? post.published : true} />
            I publikuar
          </label>
        </div>

        <button type="submit" className="btn-primary">
          {isNew ? "Publiko" : "Ruaj ndryshimet"}
        </button>
      </form>
    </div>
  );
}
