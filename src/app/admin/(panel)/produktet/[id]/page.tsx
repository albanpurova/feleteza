import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  saveProduct,
  saveProductFeature,
  deleteProductFeature,
  saveProductInfoCard,
  deleteProductInfoCard,
  saveProductFaq,
  deleteProductFaq,
  saveProductBlock,
  deleteProductBlock,
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
      blocks: { orderBy: { sortOrder: "asc" } },
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

        <Field label="Titulli i seksionit me boxa" hint='p.sh. "Çka mësojmë nga kartat?" ose "…sipas moshës dhe zhvillimit"'>
          <input name="featuresTitle" defaultValue={product?.featuresTitle ?? ""} className={inputCls} />
        </Field>

        <Field label="Seksioni A — titulli (boxa foto/titull/përshkrim)" hint='p.sh. "Pse FLETËZA?"'>
          <input name="blocksTitle" defaultValue={product?.blocksTitle ?? ""} className={inputCls} />
        </Field>

        <div className="rounded-lg border border-black/10 p-4 space-y-4">
          <p className="text-sm font-semibold text-brand-navy">Seksioni B — foto e madhe + listë me pika</p>
          <Field label="Titulli (opsional)">
            <input name="highlightTitle" defaultValue={product?.highlightTitle ?? ""} className={inputCls} />
          </Field>
          <Field label="Foto (URL)">
            <input id="highlight-img" name="highlightImage" defaultValue={product?.highlightImage ?? ""} className={inputCls} />
            <ImageUploader targetId="highlight-img" mode="replace" />
          </Field>
          <Field label="Pikat (një për rresht)" hint="Secili rresht shfaqet me një shenjë ✓">
            <textarea
              name="highlightPoints"
              defaultValue={product?.highlightPoints ?? ""}
              className={inputCls}
              rows={4}
              placeholder={"Stimulojnë trurin e bebës\nZhvillojnë shikimin dhe fokusin"}
            />
          </Field>
        </div>

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
          <label className="flex items-center gap-2 text-sm text-brand-navy">
            <input type="checkbox" name="freeShipping" defaultChecked={product?.freeShipping ?? false} />
            Transport falas në çdo shtet
          </label>
        </div>

        <button type="submit" className="btn-primary">
          {isNew ? "Krijo produktin" : "Ruaj ndryshimet"}
        </button>
      </form>

      {/* SEKSIONET E NDËRLIDHURA — vetëm për produkt ekzistues */}
      {!isNew && product && (
        <>
          {/* FEATURES — boxat e seksionit */}
          <section className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
            <div>
              <h2 className="font-display font-bold text-brand-navy">Boxat e seksionit</h2>
              <p className="text-xs text-brand-gray">
                P.sh. kategoritë (“Alfabeti”, “Objektet”…) ose fazat sipas moshës. Secili box mund të ketë foto, titull, tekst dhe ngjyrë sfondi.
              </p>
            </div>

            <div className="space-y-3">
              {product.features.map((f) => (
                <form key={f.id} action={saveProductFeature} className="rounded-lg border border-black/10 p-4 space-y-3">
                  <input type="hidden" name="id" value={f.id} />
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-brand-cream">
                      {f.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.imageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="grid flex-1 gap-2 sm:grid-cols-2">
                      <input name="title" defaultValue={f.title} placeholder="Titulli" className={inputCls} />
                      <input name="colorTag" defaultValue={f.colorTag ?? ""} placeholder="Ngjyra sfondi #fde2cf" className={inputCls} />
                    </div>
                  </div>
                  <textarea name="body" defaultValue={f.body ?? ""} placeholder="Përshkrim (mund të ketë disa rreshta)" className={inputCls} rows={2} />
                  <input id={`feat-img-${f.id}`} name="imageUrl" defaultValue={f.imageUrl ?? ""} placeholder="URL e imazhit" className={inputCls} />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ImageUploader targetId={`feat-img-${f.id}`} mode="replace" />
                      <input name="sortOrder" type="number" defaultValue={f.sortOrder} className={`${inputCls} w-24`} title="Renditja" />
                    </div>
                    <div className="flex gap-4">
                      <button className="btn-outline text-sm">Ruaj</button>
                      <button formAction={deleteProductFeature} className="text-sm text-brand-red hover:underline">Fshi</button>
                    </div>
                  </div>
                </form>
              ))}
              {product.features.length === 0 && <p className="text-brand-gray text-sm">Asnjë box ende.</p>}
            </div>

            {/* Shto box të ri */}
            <form action={saveProductFeature} className="grid gap-3 rounded-lg border border-dashed border-black/15 p-4 sm:grid-cols-2">
              <input type="hidden" name="productId" value={product.id} />
              <input name="title" placeholder="Titulli i ri (p.sh. Alfabeti)" className={inputCls} required />
              <input name="colorTag" placeholder="Ngjyra sfondi #fde2cf" className={inputCls} />
              <textarea name="body" placeholder="Përshkrim" className={`${inputCls} sm:col-span-2`} rows={2} />
              <input id="feat-img-new" name="imageUrl" placeholder="URL e imazhit" className={`${inputCls} sm:col-span-2`} />
              <div className="sm:col-span-2 flex items-center justify-between">
                <ImageUploader targetId="feat-img-new" mode="replace" />
                <button className="btn-primary text-sm">+ Shto box</button>
              </div>
            </form>
          </section>

          {/* INFO CARDS */}
          <section className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
            <h2 className="font-display font-bold text-brand-navy">Informacion rreth produktit (kartela të vogla)</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {product.infoCards.map((c) => (
                <form key={c.id} action={saveProductInfoCard} className="rounded-lg border border-black/10 p-4 space-y-3">
                  <input type="hidden" name="id" value={c.id} />
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-brand-cream">
                      {c.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.imageUrl} alt="" className="h-full w-full object-contain" />
                      )}
                    </div>
                    <input name="label" defaultValue={c.label} placeholder="Etiketa (p.sh. 180 karta)" className={`${inputCls} flex-1`} />
                  </div>
                  <input id={`info-img-${c.id}`} name="imageUrl" defaultValue={c.imageUrl ?? ""} placeholder="URL e imazhit" className={inputCls} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ImageUploader targetId={`info-img-${c.id}`} mode="replace" />
                      <input name="sortOrder" type="number" defaultValue={c.sortOrder} className={`${inputCls} w-20`} title="Renditja" />
                    </div>
                    <div className="flex gap-4">
                      <button className="btn-outline text-sm">Ruaj</button>
                      <button formAction={deleteProductInfoCard} className="text-sm text-brand-red hover:underline">Fshi</button>
                    </div>
                  </div>
                </form>
              ))}
              {product.infoCards.length === 0 && <p className="text-brand-gray text-sm">Asnjë kartelë.</p>}
            </div>

            <form action={saveProductInfoCard} className="grid gap-3 rounded-lg border border-dashed border-black/15 p-4 sm:grid-cols-2">
              <input type="hidden" name="productId" value={product.id} />
              <input name="label" placeholder="Etiketa e re (p.sh. 14 × 11 cm)" className={inputCls} required />
              <input id="info-img-new" name="imageUrl" placeholder="URL e imazhit" className={inputCls} />
              <div className="sm:col-span-2 flex items-center justify-between">
                <ImageUploader targetId="info-img-new" mode="replace" />
                <button className="btn-primary text-sm">+ Shto kartelë</button>
              </div>
            </form>
          </section>

          {/* SEKSIONI A — BOXA (foto/titull/përshkrim) */}
          <section className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
            <div>
              <h2 className="font-display font-bold text-brand-navy">Seksioni A — boxat (foto sipër, titull, përshkrim)</h2>
              <p className="text-xs text-brand-gray">3 boxa horizontal nën titullin e “Seksionit A”.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {product.blocks.map((b) => (
                <form key={b.id} action={saveProductBlock} className="rounded-lg border border-black/10 p-4 space-y-3">
                  <input type="hidden" name="id" value={b.id} />
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-brand-cream">
                      {b.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.imageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <input name="title" defaultValue={b.title} placeholder="Titulli" className={`${inputCls} flex-1`} />
                  </div>
                  <textarea name="body" defaultValue={b.body ?? ""} placeholder="Përshkrim" className={inputCls} rows={2} />
                  <input id={`block-img-${b.id}`} name="imageUrl" defaultValue={b.imageUrl ?? ""} placeholder="URL e imazhit" className={inputCls} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ImageUploader targetId={`block-img-${b.id}`} mode="replace" />
                      <input name="sortOrder" type="number" defaultValue={b.sortOrder} className={`${inputCls} w-20`} title="Renditja" />
                    </div>
                    <div className="flex gap-4">
                      <button className="btn-outline text-sm">Ruaj</button>
                      <button formAction={deleteProductBlock} className="text-sm text-brand-red hover:underline">Fshi</button>
                    </div>
                  </div>
                </form>
              ))}
              {product.blocks.length === 0 && <p className="text-brand-gray text-sm">Asnjë box.</p>}
            </div>

            <form action={saveProductBlock} className="grid gap-3 rounded-lg border border-dashed border-black/15 p-4 sm:grid-cols-2">
              <input type="hidden" name="productId" value={product.id} />
              <input name="title" placeholder="Titulli i ri" className={inputCls} required />
              <input id="block-img-new" name="imageUrl" placeholder="URL e imazhit" className={inputCls} />
              <textarea name="body" placeholder="Përshkrim" className={`${inputCls} sm:col-span-2`} rows={2} />
              <div className="sm:col-span-2 flex items-center justify-between">
                <ImageUploader targetId="block-img-new" mode="replace" />
                <button className="btn-primary text-sm">+ Shto box</button>
              </div>
            </form>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
            <h2 className="font-display font-bold text-brand-navy">Pyetjet më të shpeshta</h2>

            <div className="space-y-3">
              {product.faqs.map((q) => (
                <form key={q.id} action={saveProductFaq} className="rounded-lg border border-black/10 p-4 space-y-2">
                  <input type="hidden" name="id" value={q.id} />
                  <input name="question" defaultValue={q.question} placeholder="Pyetja" className={inputCls} />
                  <textarea name="answer" defaultValue={q.answer} placeholder="Përgjigja" className={inputCls} rows={2} />
                  <div className="flex items-center justify-between">
                    <input name="sortOrder" type="number" defaultValue={q.sortOrder} className={`${inputCls} w-24`} title="Renditja" />
                    <div className="flex gap-4">
                      <button className="btn-outline text-sm">Ruaj</button>
                      <button formAction={deleteProductFaq} className="text-sm text-brand-red hover:underline">Fshi</button>
                    </div>
                  </div>
                </form>
              ))}
              {product.faqs.length === 0 && <p className="text-brand-gray text-sm">Asnjë pyetje.</p>}
            </div>

            <form action={saveProductFaq} className="space-y-3 rounded-lg border border-dashed border-black/15 p-4">
              <input type="hidden" name="productId" value={product.id} />
              <input name="question" placeholder="Pyetja e re" className={inputCls} required />
              <textarea name="answer" placeholder="Përgjigja" className={inputCls} rows={3} required />
              <div className="flex justify-end">
                <button className="btn-primary text-sm">+ Shto pyetje</button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
