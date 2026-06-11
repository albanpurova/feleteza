import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  saveProduct,
  addProductFeature,
  deleteProductFeature,
  addProductInfoCard,
  deleteProductInfoCard,
  addProductFaq,
  deleteProductFaq,
} from "@/app/admin/actions-products";
import ImageUploader from "@/components/ImageUploader";

export const dynamic = "force-dynamic";

async function loadProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      bullets: { orderBy: { sortOrder: "asc" } },
      features: { orderBy: { sortOrder: "asc" } },
      infoCards: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-brand-navy mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-brand-gray mt-1">{hint}</span>}
    </label>
  );
}

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  let product: Awaited<ReturnType<typeof loadProduct>> = null;
  if (!isNew) {
    try {
      product = await loadProduct(id);
    } catch (e) {
      console.error("[admin] product edit:", e);
    }
    if (!product) notFound();
  }

  const inputCls = "input-field";

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/produktet" className="text-sm text-brand-green hover:underline">
          ← Produktet
        </Link>
        <h1 className="text-2xl font-display font-bold text-brand-navy">
          {isNew ? "Produkt i ri" : product!.name}
        </h1>
      </div>

      {/* FORMA KRYESORE */}
      <form action={saveProduct} className="bg-white rounded-xl border border-black/5 p-6 space-y-5">
        {!isNew && <input type="hidden" name="id" value={product!.id} />}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Emri *">
            <input name="name" defaultValue={product?.name ?? ""} className={inputCls} required />
          </Field>
          <Field label="Slug" hint="Lihet bosh për ta gjeneruar automatikisht">
            <input name="slug" defaultValue={product?.slug ?? ""} className={inputCls} />
          </Field>
        </div>

        <Field label="Përshkrim i shkurtër" hint="Teksti poshtë çmimit (p.sh. info transporti)">
          <textarea
            name="shortDesc"
            defaultValue={product?.shortDesc ?? ""}
            className={inputCls}
            rows={2}
          />
        </Field>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Çmimi (€) *">
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={product ? Number(product.price) : ""}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Çmimi i vjetër (€)" hint="Opsional">
            <input
              name="compareAtPrice"
              type="number"
              step="0.01"
              defaultValue={product?.compareAtPrice ? Number(product.compareAtPrice) : ""}
              className={inputCls}
            />
          </Field>
          <Field label="Stoku">
            <input
              name="stock"
              type="number"
              defaultValue={product?.stock ?? 0}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="SKU">
            <input name="sku" defaultValue={product?.sku ?? ""} className={inputCls} />
          </Field>
          <Field label="Mosha" hint='p.sh. "1–6+ vjeç"'>
            <input name="ageRange" defaultValue={product?.ageRange ?? ""} className={inputCls} />
          </Field>
          <Field label="Renditja">
            <input
              name="sortOrder"
              type="number"
              defaultValue={product?.sortOrder ?? 0}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Shënim transporti" hint="Shfaqet te faqja e produktit">
          <input name="shippingNote" defaultValue={product?.shippingNote ?? ""} className={inputCls} />
        </Field>

        <Field label="Përshkrimi i plotë" hint="Mund të përdoret HTML i thjeshtë">
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            className={inputCls}
            rows={6}
          />
        </Field>

        <Field label="Imazhet (një URL për rresht)">
          <textarea
            id="product-images"
            name="images"
            defaultValue={product?.images.map((i) => i.url).join("\n") ?? ""}
            className={inputCls}
            rows={4}
            placeholder="/uploads/foto.jpg"
          />
          <ImageUploader targetId="product-images" />
        </Field>

        <Field label="Karakteristikat — bullets (një për rresht)">
          <textarea
            name="bullets"
            defaultValue={product?.bullets.map((b) => b.text).join("\n") ?? ""}
            className={inputCls}
            rows={4}
            placeholder="6 kategori edukative"
          />
        </Field>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input type="checkbox" name="active" defaultChecked={product ? product.active : true} />
            Aktiv (i dukshëm në dyqan)
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
            Në homepage (një nga 3 boxat)
          </label>
        </div>

        <button type="submit" className="btn-primary">
          {isNew ? "Krijo produktin" : "Ruaj ndryshimet"}
        </button>
      </form>

      {/* SEKSIONET E NDËRLIDHURA — vetëm për produkt ekzistues */}
      {!isNew && product && (
        <>
          {/* FEATURES — Çka mësojmë nga kartat */}
          <section className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
            <h2 className="font-display font-bold text-brand-navy">Çka mësojmë nga kartat? (kategoritë)</h2>
            <div className="space-y-2">
              {product.features.map((f) => (
                <div key={f.id} className="flex items-start justify-between gap-3 border-b border-black/5 pb-2">
                  <div className="text-sm">
                    <span className="font-medium text-brand-navy">{f.title}</span>
                    {f.body && <p className="text-brand-gray text-xs">{f.body}</p>}
                  </div>
                  <form action={deleteProductFeature}>
                    <input type="hidden" name="id" value={f.id} />
                    <button className="text-xs text-brand-red hover:underline">Fshi</button>
                  </form>
                </div>
              ))}
              {product.features.length === 0 && <p className="text-brand-gray text-sm">Asnjë kategori.</p>}
            </div>
            <form action={addProductFeature} className="grid sm:grid-cols-2 gap-3 pt-2">
              <input type="hidden" name="productId" value={product.id} />
              <input name="title" placeholder="Titulli (p.sh. Alfabeti)" className={inputCls} required />
              <input name="body" placeholder="Përshkrim i shkurtër" className={inputCls} />
              <input name="colorTag" placeholder="Ngjyra (p.sh. #fde2cf)" className={inputCls} />
              <input name="sortOrder" type="number" placeholder="Renditja" className={inputCls} />
              <button className="btn-outline sm:col-span-2">+ Shto kategori</button>
            </form>
          </section>

          {/* INFO CARDS */}
          <section className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
            <h2 className="font-display font-bold text-brand-navy">Informacion rreth produktit (kartela)</h2>
            <div className="space-y-2">
              {product.infoCards.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 border-b border-black/5 pb-2">
                  <span className="text-sm text-brand-navy">{c.label}</span>
                  <form action={deleteProductInfoCard}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-xs text-brand-red hover:underline">Fshi</button>
                  </form>
                </div>
              ))}
              {product.infoCards.length === 0 && <p className="text-brand-gray text-sm">Asnjë kartelë.</p>}
            </div>
            <form action={addProductInfoCard} className="grid sm:grid-cols-2 gap-3 pt-2">
              <input type="hidden" name="productId" value={product.id} />
              <input name="label" placeholder="Etiketa (p.sh. 180 karta)" className={inputCls} required />
              <input id="infocard-img" name="imageUrl" placeholder="URL e imazhit" className={inputCls} />
              <input name="sortOrder" type="number" placeholder="Renditja" className={inputCls} />
              <div className="sm:col-span-2">
                <ImageUploader targetId="infocard-img" mode="replace" />
              </div>
              <button className="btn-outline sm:col-span-2">+ Shto kartelë</button>
            </form>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
            <h2 className="font-display font-bold text-brand-navy">Pyetjet më të shpeshta</h2>
            <div className="space-y-2">
              {product.faqs.map((q) => (
                <div key={q.id} className="flex items-start justify-between gap-3 border-b border-black/5 pb-2">
                  <div className="text-sm">
                    <span className="font-medium text-brand-navy">{q.question}</span>
                    <p className="text-brand-gray text-xs">{q.answer}</p>
                  </div>
                  <form action={deleteProductFaq}>
                    <input type="hidden" name="id" value={q.id} />
                    <button className="text-xs text-brand-red hover:underline">Fshi</button>
                  </form>
                </div>
              ))}
              {product.faqs.length === 0 && <p className="text-brand-gray text-sm">Asnjë pyetje.</p>}
            </div>
            <form action={addProductFaq} className="space-y-3 pt-2">
              <input type="hidden" name="productId" value={product.id} />
              <input name="question" placeholder="Pyetja" className={inputCls} required />
              <textarea name="answer" placeholder="Përgjigja" className={inputCls} rows={3} required />
              <input name="sortOrder" type="number" placeholder="Renditja" className={inputCls} />
              <button className="btn-outline">+ Shto pyetje</button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
