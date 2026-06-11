"use client";

import { useState } from "react";

export default function KontaktiPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!form.email || !form.message) {
      setError("Ju lutemi plotësoni email-in dhe mesazhin.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSent(true);
      else setError("Ndodhi një gabim. Provoni përsëri.");
    } catch {
      setError("Gabim me lidhjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 py-16 md:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-brand-navy">Na kontaktoni</h1>
          {sent ? (
            <p className="mt-6 rounded-xl bg-brand-green/10 p-4 text-brand-green">
              Faleminderit! Mesazhi juaj u dërgua me sukses.
            </p>
          ) : (
            <div className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input-field" placeholder="Emri dhe Mbiemri" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="input-field" placeholder="Shkruaj email adresën tënde" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <input className="input-field" placeholder="Nr. i tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <textarea className="input-field" rows={6} placeholder="Shkruaj një mesazh" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {error && <p className="text-sm text-brand-red">{error}</p>}
              <button onClick={submit} disabled={loading} className="btn-primary uppercase">
                {loading ? "..." : "Dërgo mesazhin"}
              </button>
            </div>
          )}

          <div className="mt-12">
            <h3 className="font-display text-xl font-bold text-brand-navy">Email adresa</h3>
            <p className="mt-1 text-brand-navy-light">info@fleteza.com</p>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="aspect-square rounded-full bg-brand-cream" />
        </div>
      </div>
    </div>
  );
}
