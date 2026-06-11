import { prisma } from "@/lib/prisma";
import {
  saveReason,
  deleteReason,
  saveExpert,
  deleteExpert,
  saveReview,
  deleteReview,
  saveMoment,
  deleteMoment,
  saveFaq,
  deleteFaq,
  saveSettings,
} from "@/app/admin/actions-content";
import ImageUploader from "@/components/ImageUploader";

export const dynamic = "force-dynamic";

const inputCls = "input-field";

async function loadAll() {
  try {
    const [reasons, experts, reviews, moments, faqs, settingsRows] = await Promise.all([
      prisma.homeReason.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.expertCard.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.review.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.momentMedia.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.siteSetting.findMany(),
    ]);
    const settings = Object.fromEntries(settingsRows.map((r) => [r.key, r.value])) as Record<string, string>;
    return { ok: true as const, reasons, experts, reviews, moments, faqs, settings };
  } catch (e) {
    console.error("[admin] kontenti:", e);
    return { ok: false as const };
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-black/5 p-6 space-y-4">
      <h2 className="font-display font-bold text-brand-navy text-lg">{title}</h2>
      {children}
    </section>
  );
}

export default async function AdminContentPage() {
  const d = await loadAll();

  if (!d.ok) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-4">Kontenti</h1>
        <p className="text-brand-gray">Nuk u lidh dot me bazën e të dhënave.</p>
      </div>
    );
  }

  const SETTING_FIELDS: { key: string; label: string }[] = [
    { key: "hero_title", label: "Titulli i hero-it" },
    { key: "hero_subtitle", label: "Nëntitulli i hero-it" },
    { key: "mission_text", label: "Teksti i misionit (banderola e kuqe)" },
    { key: "reviews_heading", label: "Titulli i seksionit Reviews" },
    { key: "contact_email", label: "Email kontakti" },
    { key: "shipping_kosovo", label: "Transporti — Kosovë (€)" },
    { key: "shipping_other", label: "Transporti — Shqipëri/Maqedoni (€)" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-display font-bold text-brand-navy">Kontenti i faqes</h1>

      {/* CILËSIMET */}
      <Section title="Cilësimet e përgjithshme">
        <form action={saveSettings} className="space-y-4">
          {SETTING_FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="block text-sm font-semibold text-brand-navy mb-1">{f.label}</span>
              {f.key === "mission_text" || f.key === "hero_subtitle" ? (
                <textarea
                  name={`setting__${f.key}`}
                  defaultValue={d.settings[f.key] ?? ""}
                  className={inputCls}
                  rows={2}
                />
              ) : (
                <input
                  name={`setting__${f.key}`}
                  defaultValue={d.settings[f.key] ?? ""}
                  className={inputCls}
                />
              )}
            </label>
          ))}
          <button className="btn-primary">Ruaj cilësimet</button>
        </form>
      </Section>

      {/* PSE FLETËZA */}
      <Section title="Pse FLETËZA? (arsyet)">
        <div className="space-y-3">
          {d.reasons.map((r) => (
            <form key={r.id} action={saveReason} className="border border-black/5 rounded-lg p-4 grid sm:grid-cols-2 gap-3">
              <input type="hidden" name="id" value={r.id} />
              <input name="title" defaultValue={r.title} placeholder="Titulli" className={inputCls} />
              <input name="sortOrder" type="number" defaultValue={r.sortOrder} placeholder="Renditja" className={inputCls} />
              <textarea name="body" defaultValue={r.body} placeholder="Teksti" className={`${inputCls} sm:col-span-2`} rows={2} />
              <input id={`reason-img-${r.id}`} name="imageUrl" defaultValue={r.imageUrl ?? ""} placeholder="URL imazhi" className={`${inputCls} sm:col-span-2`} />
              <div className="sm:col-span-2 flex items-center justify-between">
                <ImageUploader targetId={`reason-img-${r.id}`} mode="replace" />
                <div className="flex gap-3">
                  <button className="btn-outline text-sm">Ruaj</button>
                  <button formAction={deleteReason} className="text-sm text-brand-red hover:underline">
                    Fshi
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
        <AddForm action={saveReason} title="Shto arsye">
          <input name="title" placeholder="Titulli" className={inputCls} required />
          <textarea name="body" placeholder="Teksti" className={`${inputCls} sm:col-span-2`} rows={2} />
          <input name="sortOrder" type="number" placeholder="Renditja" className={inputCls} />
        </AddForm>
      </Section>

      {/* EKSPERTËT */}
      <Section title="Ekspertët (logopedë, psikologë…)">
        <div className="space-y-3">
          {d.experts.map((x) => (
            <form key={x.id} action={saveExpert} className="border border-black/5 rounded-lg p-4 grid sm:grid-cols-2 gap-3">
              <input type="hidden" name="id" value={x.id} />
              <input name="label" defaultValue={x.label} placeholder="Etiketa" className={inputCls} />
              <input name="sortOrder" type="number" defaultValue={x.sortOrder} placeholder="Renditja" className={inputCls} />
              <input id={`expert-img-${x.id}`} name="imageUrl" defaultValue={x.imageUrl ?? ""} placeholder="URL imazhi" className={`${inputCls} sm:col-span-2`} />
              <div className="sm:col-span-2 flex items-center justify-between">
                <ImageUploader targetId={`expert-img-${x.id}`} mode="replace" />
                <div className="flex gap-3">
                  <button className="btn-outline text-sm">Ruaj</button>
                  <button formAction={deleteExpert} className="text-sm text-brand-red hover:underline">
                    Fshi
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
        <AddForm action={saveExpert} title="Shto ekspert">
          <input name="label" placeholder="Etiketa (p.sh. LOGOPEDË)" className={inputCls} required />
          <input name="imageUrl" placeholder="URL imazhi" className={inputCls} />
          <input name="sortOrder" type="number" placeholder="Renditja" className={inputCls} />
        </AddForm>
      </Section>

      {/* REVIEWS */}
      <Section title="Vlerësimet (Reviews)">
        <div className="space-y-3">
          {d.reviews.map((rv) => (
            <form key={rv.id} action={saveReview} className="border border-black/5 rounded-lg p-4 grid sm:grid-cols-2 gap-3">
              <input type="hidden" name="id" value={rv.id} />
              <input name="authorName" defaultValue={rv.authorName} placeholder="Emri" className={inputCls} />
              <input name="rating" type="number" min={1} max={5} defaultValue={rv.rating} placeholder="Yjet (1-5)" className={inputCls} />
              <textarea name="text" defaultValue={rv.text} placeholder="Teksti" className={`${inputCls} sm:col-span-2`} rows={2} />
              <input id={`review-img-${rv.id}`} name="imageUrl" defaultValue={rv.imageUrl ?? ""} placeholder="URL imazhi" className={inputCls} />
              <input name="sortOrder" type="number" defaultValue={rv.sortOrder} placeholder="Renditja" className={inputCls} />
              <div className="sm:col-span-2 flex items-center justify-between">
                <ImageUploader targetId={`review-img-${rv.id}`} mode="replace" />
                <div className="flex gap-3">
                  <button className="btn-outline text-sm">Ruaj</button>
                  <button formAction={deleteReview} className="text-sm text-brand-red hover:underline">
                    Fshi
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
        <AddForm action={saveReview} title="Shto vlerësim">
          <input name="authorName" placeholder="Emri" className={inputCls} required />
          <input name="rating" type="number" min={1} max={5} defaultValue={5} placeholder="Yjet" className={inputCls} />
          <textarea name="text" placeholder="Teksti" className={`${inputCls} sm:col-span-2`} rows={2} required />
          <input name="sortOrder" type="number" placeholder="Renditja" className={inputCls} />
        </AddForm>
      </Section>

      {/* MOMENTE */}
      <Section title="Momente të ndara nga prindërit (galeria)">
        <div className="grid sm:grid-cols-2 gap-3">
          {d.moments.map((m) => (
            <form key={m.id} action={saveMoment} className="border border-black/5 rounded-lg p-4 space-y-2">
              <input type="hidden" name="id" value={m.id} />
              <input id={`moment-img-${m.id}`} name="imageUrl" defaultValue={m.imageUrl} placeholder="URL imazhi" className={inputCls} />
              <input name="sortOrder" type="number" defaultValue={m.sortOrder} placeholder="Renditja" className={inputCls} />
              <div className="flex items-center justify-between">
                <ImageUploader targetId={`moment-img-${m.id}`} mode="replace" />
                <div className="flex gap-3">
                  <button className="btn-outline text-sm">Ruaj</button>
                  <button formAction={deleteMoment} className="text-sm text-brand-red hover:underline">
                    Fshi
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
        <AddForm action={saveMoment} title="Shto moment">
          <input name="imageUrl" placeholder="URL imazhi" className={`${inputCls} sm:col-span-2`} required />
          <input name="sortOrder" type="number" placeholder="Renditja" className={inputCls} />
        </AddForm>
      </Section>

      {/* FAQ GLOBAL */}
      <Section title="Pyetjet më të shpeshta (globale)">
        <div className="space-y-3">
          {d.faqs.map((q) => (
            <form key={q.id} action={saveFaq} className="border border-black/5 rounded-lg p-4 space-y-2">
              <input type="hidden" name="id" value={q.id} />
              <input name="question" defaultValue={q.question} placeholder="Pyetja" className={inputCls} />
              <textarea name="answer" defaultValue={q.answer} placeholder="Përgjigja" className={inputCls} rows={2} />
              <div className="flex items-center justify-between">
                <input name="sortOrder" type="number" defaultValue={q.sortOrder} placeholder="Renditja" className={`${inputCls} w-28`} />
                <div className="flex gap-3">
                  <button className="btn-outline text-sm">Ruaj</button>
                  <button formAction={deleteFaq} className="text-sm text-brand-red hover:underline">
                    Fshi
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
        <AddForm action={saveFaq} title="Shto pyetje">
          <input name="question" placeholder="Pyetja" className={`${inputCls} sm:col-span-2`} required />
          <textarea name="answer" placeholder="Përgjigja" className={`${inputCls} sm:col-span-2`} rows={2} required />
          <input name="sortOrder" type="number" placeholder="Renditja" className={inputCls} />
        </AddForm>
      </Section>
    </div>
  );
}

// Helpers (server components)
function AddForm({
  action,
  title,
  children,
}: {
  action: (fd: FormData) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-black/5">
      {children}
      <button className="btn-primary text-sm sm:col-span-2 justify-self-start">+ {title}</button>
    </form>
  );
}
