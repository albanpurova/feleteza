"use client";

import { useState } from "react";

/**
 * Ngarkon një imazh në /api/admin/upload dhe e shton URL-në te fusha e synuar.
 * - targetId: id e një <textarea> (shton URL në rresht të ri) ose <input> (zëvendëson vlerën).
 */
export default function ImageUploader({
  targetId,
  mode = "append",
  label = "Ngarko imazh",
}: {
  targetId: string;
  mode?: "append" | "replace";
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error || "Ngarkimi dështoi");
        return;
      }
      const el = document.getElementById(targetId) as
        | HTMLTextAreaElement
        | HTMLInputElement
        | null;
      if (el) {
        if (mode === "append") {
          el.value = (el.value ? el.value.trimEnd() + "\n" : "") + data.url;
        } else {
          el.value = data.url;
        }
      }
      setMsg("U ngarkua ✓");
    } catch {
      setMsg("Gabim në ngarkim");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <label className="text-xs cursor-pointer bg-brand-cream-dark text-brand-navy px-3 py-1.5 rounded-lg hover:bg-brand-cream border border-black/5">
        {busy ? "Duke ngarkuar…" : label}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
      </label>
      {msg && <span className="text-xs text-brand-gray">{msg}</span>}
    </div>
  );
}
