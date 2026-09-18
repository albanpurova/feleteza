"use client";

import { useState } from "react";

export default function ReviewForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [mediaUrl, setMediaUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function uploadMedia(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/reviews/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data?.ok) setMediaUrl(data.url);
      else setError(data?.error || "Ngarkimi dështoi (max ~4MB).");
    } catch {
      setError("Ngarkimi dështoi.");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    if (!name.trim() || !text.trim()) {
      setError("Emri dhe komenti janë të detyrueshëm.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: name, email, text, rating, imageUrl: mediaUrl }),
      });
      const data = await res.json();
      if (data?.ok) setDone(true);
      else setError(data?.error || "Diçka shkoi keq.");
    } catch {
      setError("Diçka shkoi keq.");
    } finally {
      setBusy(false);
    }
  }

  function close() {
    setOpen(false);
    // reset pas mbylljes
    setTimeout(() => {
      setDone(false);
      setName(""); setEmail(""); setText(""); setRating(5); setMediaUrl(""); setError("");
    }, 200);
  }

  const input = "w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-base outline-none focus:border-brand-green";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto mt-8 block rounded-full border-2 border-brand-green px-6 py-2.5 text-base font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
      >
        Lini një vlerësim
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-brand-navy">Lini një vlerësim</h3>
              <button type="button" onClick={close} aria-label="Mbyll" className="text-brand-gray hover:text-brand-navy">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            {done ? (
              <div className="py-8 text-center">
                <p className="text-lg font-semibold text-brand-green">Faleminderit!</p>
                <p className="mt-2 text-base text-brand-navy-light">
                  Vlerësimi juaj u dërgua dhe do të shfaqet pas aprovimit.
                </p>
                <button onClick={close} className="btn-primary mt-6">Mbyll</button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <input className={input} placeholder="Emri dhe mbiemri" value={name} onChange={(e) => setName(e.target.value)} />
                <input className={input} placeholder="Email (opsional)" value={email} onChange={(e) => setEmail(e.target.value)} />

                <div className="flex items-center gap-2">
                  <span className="text-base text-brand-navy">Vlerësimi:</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} yje`}
                      className={n <= rating ? "text-brand-yellow" : "text-gray-300"}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9z" /></svg>
                    </button>
                  ))}
                </div>

                <textarea className={input} rows={4} placeholder="Komenti juaj" value={text} onChange={(e) => setText(e.target.value)} />

                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-brand-cream px-3 py-2 text-base text-brand-navy hover:bg-brand-cream-dark">
                    {uploading ? "Duke ngarkuar…" : "Ngarko imazh ose video"}
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMedia(f); e.target.value = ""; }} />
                  </label>
                  {mediaUrl && <p className="mt-1 text-sm text-brand-green">Media u ngarkua ✓</p>}
                </div>

                {error && <p className="text-sm text-brand-red">{error}</p>}

                <button onClick={submit} disabled={busy || uploading} className="btn-primary w-full justify-center disabled:opacity-60">
                  {busy ? "Duke dërguar…" : "Dërgo vlerësimin"}
                </button>
                <p className="text-center text-sm text-brand-gray">Vlerësimi shfaqet pas aprovimit nga stafi.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
