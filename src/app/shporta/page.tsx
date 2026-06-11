"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatEuro } from "@/lib/format";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  country: string;
  note: string;
};

const empty: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  country: "",
  note: "",
};

export default function ShportaPage() {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const required: (keyof Form)[] = ["firstName", "lastName", "phone", "city", "address", "country"];
  const total = subtotal; // COD; transporti i përfshirë

  function set<K extends keyof Form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    const errs: Record<string, boolean> = {};
    required.forEach((k) => {
      if (!form[k].trim()) errs[k] = true;
    });
    if (items.length === 0) return;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Ndodhi një gabim. Provoni përsëri.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/porosia-u-konfirmua?nr=${encodeURIComponent(data.orderNumber)}`);
    } catch {
      setServerError("Ndodhi një gabim me lidhjen. Provoni përsëri.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-navy">Shporta është bosh</h1>
        <p className="mt-2 text-brand-gray">Shtoni produkte për të vazhduar me blerjen.</p>
        <Link href="/produktet" className="btn-primary mt-6">Shiko produktet</Link>
      </div>
    );
  }

  return (
    <div className="container-x grid gap-12 py-12 lg:grid-cols-2">
      {/* FORMULARI */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-brand-navy">Formulari i blerjes</h1>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field label="Emri*" value={form.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} />
          <Field label="Mbiemri*" value={form.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} />
          <Field label="E-mail" type="email" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Numri i telefonit*" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
          <Field label="Qyteti*" value={form.city} onChange={(v) => set("city", v)} error={errors.city} />
          <Field label="Adresa*" value={form.address} onChange={(v) => set("address", v)} error={errors.address} />
          <Field label="Shteti*" value={form.country} onChange={(v) => set("country", v)} error={errors.country} />
        </div>
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-semibold text-brand-navy">Shënime shtesë (opcionale)</label>
          <textarea
            rows={4}
            className="input-field"
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
          />
        </div>
      </div>

      {/* SHPORTA */}
      <div>
        <h2 className="font-display text-3xl font-extrabold text-brand-navy">Shporta</h2>
        <div className="mt-8 divide-y divide-gray-100">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center gap-4 py-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                {i.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.image} alt={i.name} className="h-full w-full object-contain" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-brand-navy">{i.name}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button onClick={() => updateQty(i.productId, i.quantity - 1)} className="px-3 py-1.5 text-brand-navy">−</button>
                    <span className="w-9 text-center text-sm">{i.quantity}</span>
                    <button onClick={() => updateQty(i.productId, i.quantity + 1)} className="px-3 py-1.5 text-brand-navy">+</button>
                  </div>
                  <button onClick={() => removeItem(i.productId)} className="text-xs font-semibold text-brand-red">Hiq</button>
                </div>
              </div>
              <div className="text-right font-bold text-brand-navy">{formatEuro(i.price * i.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="font-semibold uppercase tracking-wide text-brand-navy">Total</span>
            <span className="text-lg font-bold text-brand-navy">{formatEuro(total)}</span>
          </div>
          <p className="mt-3 text-sm text-brand-gray">
            Pagesa: <strong className="text-brand-navy">Para në dorë (Cash on Delivery)</strong>
          </p>
          {serverError && <p className="mt-3 text-sm text-brand-red">{serverError}</p>}
          <button onClick={submit} disabled={submitting} className="btn-teal mt-4 w-full">
            {submitting ? "Duke procesuar..." : "Konfirmo porosinë"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-navy">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-field ${error ? "border-brand-red ring-1 ring-brand-red/30" : ""}`}
      />
    </div>
  );
}
