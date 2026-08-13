"use client";

import { useState } from "react";

/**
 * Menaxhim i fotove të produktit si thumbnail-e (me X për fshirje + ngarkim).
 * Ruajtja mbetet e njëjtë: një input i fshehur me emrin `name` që mban URL-të (një për rresht).
 */
export default function ImagesField({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const initial = defaultValue.split("\n").map((s) => s.trim()).filter(Boolean);
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState("");

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data?.ok) setUrls((u) => [...u, data.url]);
      }
    } finally {
      setBusy(false);
    }
  }

  function remove(i: number) {
    setUrls((u) => u.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: number) {
    setUrls((u) => {
      const j = i + dir;
      if (j < 0 || j >= u.length) return u;
      const copy = [...u];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function addManual() {
    const v = manual.trim();
    if (v) {
      setUrls((u) => [...u, v]);
      setManual("");
    }
  }

  return (
    <div>
      {/* Vlera që dërgohet me formularin (URL një për rresht) */}
      <input type="hidden" name={name} value={urls.join("\n")} />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-black/10 bg-brand-cream"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-contain" />

            {i === 0 && (
              <span className="absolute left-1 top-1 rounded bg-brand-green px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Kryesore
              </span>
            )}

            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Fshi foton"
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)} aria-label="Zhvendos majtas" className="grid h-6 w-6 place-items-center rounded bg-white/90 text-brand-navy shadow hover:bg-white">
                ‹
              </button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Zhvendos djathtas" className="grid h-6 w-6 place-items-center rounded bg-white/90 text-brand-navy shadow hover:bg-white">
                ›
              </button>
            </div>
          </div>
        ))}

        <label className="grid aspect-square cursor-pointer place-items-center rounded-lg border-2 border-dashed border-black/15 p-2 text-center text-xs text-brand-gray hover:bg-black/5">
          {busy ? "Duke ngarkuar…" : "+ Ngarko foto"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="ose ngjit URL të fotos"
          className="flex-1 rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm outline-none"
        />
        <button type="button" onClick={addManual} className="btn-outline text-sm">
          Shto
        </button>
      </div>
      <p className="mt-1 text-xs text-brand-gray">Foto e parë është kryesorja. Përdor shigjetat për ta renditur.</p>
    </div>
  );
}
