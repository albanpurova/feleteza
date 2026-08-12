"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

/**
 * Ngarkim direkt te Vercel Blob nga shfletuesi (pa limitin 4.5MB) — për video të mëdha.
 * URL-ja e ngarkuar vendoset te fusha me id-në `targetId`.
 */
export default function BlobUploader({
  targetId,
  label = "Ngarko video",
  accept = "video/*",
}: {
  targetId: string;
  label?: string;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState("");

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setPct(0);
    setMsg("");
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const blob = await upload(`uploads/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
        onUploadProgress: (p) => setPct(Math.round(p.percentage)),
      });
      const el = document.getElementById(targetId) as HTMLInputElement | null;
      if (el) el.value = blob.url;
      setMsg("U ngarkua ✓");
    } catch (err) {
      console.error(err);
      setMsg("Ngarkimi dështoi");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="cursor-pointer rounded-lg border border-black/5 bg-brand-cream-dark px-3 py-1.5 text-xs text-brand-navy hover:bg-brand-cream">
        {busy ? `Duke ngarkuar… ${pct}%` : label}
        <input type="file" accept={accept} className="hidden" onChange={handle} disabled={busy} />
      </label>
      {msg && <span className="text-xs text-brand-gray">{msg}</span>}
    </div>
  );
}
