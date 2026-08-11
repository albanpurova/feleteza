"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Editor i thjeshtë WYSIWYG (si WordPress-i): pamje vizuale + kalim në HTML.
 * Mbështet: bold, italik, tituj (H2/H3), paragraf, lista, lidhje, foto.
 * Vlera dërgohet përmes një input-i të fshehur me emrin `name`.
 */
export default function RichTextEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [html, setHtml] = useState(defaultValue);
  const [showHtml, setShowHtml] = useState(false);
  const [busy, setBusy] = useState(false);

  // Mbush editorin kur montohet ose kur kthehemi nga HTML te pamja vizuale
  useEffect(() => {
    if (!showHtml && editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHtml]);

  function sync() {
    if (editorRef.current) setHtml(editorRef.current.innerHTML);
  }

  // Ruaj pozicionin e kursorit brenda editorit
  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }

  // Riktheje kursorin aty ku ishte (para se u hap dialogu i fotos)
  function restoreSelection() {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }

  function exec(cmd: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    sync();
  }

  function addLink() {
    saveSelection();
    const url = window.prompt("Vendos URL-në e lidhjes:", "https://");
    if (url) {
      restoreSelection();
      document.execCommand("createLink", false, url);
      sync();
    }
  }

  async function uploadImage(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data?.ok) {
        restoreSelection(); // fut foton aty ku ishte kursori, jo në fillim
        document.execCommand("insertHTML", false, `<img src="${data.url}" alt="" /><p><br/></p>`);
        sync();
      }
    } finally {
      setBusy(false);
    }
  }

  const btn = "px-2.5 py-1 rounded text-sm text-brand-navy hover:bg-black/5 border border-transparent";
  // Butonat e formatimit s'duhet ta humbin fokusin/kursorin e editorit
  const noBlur = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="rounded-lg border border-black/15 bg-white">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 border-b border-black/10 p-2">
        <button type="button" onMouseDown={noBlur} className={`${btn} font-bold`} onClick={() => exec("bold")} title="Trash">B</button>
        <button type="button" onMouseDown={noBlur} className={`${btn} italic`} onClick={() => exec("italic")} title="Pjerrët">I</button>
        <span className="mx-1 h-5 w-px bg-black/10" />
        <button type="button" onMouseDown={noBlur} className={btn} onClick={() => exec("formatBlock", "<h2>")}>Titull</button>
        <button type="button" onMouseDown={noBlur} className={btn} onClick={() => exec("formatBlock", "<h3>")}>Nëntitull</button>
        <button type="button" onMouseDown={noBlur} className={btn} onClick={() => exec("formatBlock", "<p>")}>Paragraf</button>
        <span className="mx-1 h-5 w-px bg-black/10" />
        <button type="button" onMouseDown={noBlur} className={btn} onClick={() => exec("insertUnorderedList")}>• Listë</button>
        <button type="button" onMouseDown={noBlur} className={btn} onClick={() => exec("insertOrderedList")}>1. Listë</button>
        <span className="mx-1 h-5 w-px bg-black/10" />
        <button type="button" onMouseDown={noBlur} className={btn} onClick={addLink}>🔗 Lidhje</button>
        <label className={`${btn} cursor-pointer`} onMouseDown={saveSelection}>
          {busy ? "Duke ngarkuar…" : "🖼 Foto"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImage(f);
              e.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          className={`${btn} ml-auto ${showHtml ? "bg-brand-navy text-white hover:bg-brand-navy" : ""}`}
          onClick={() => {
            if (showHtml && editorRef.current) editorRef.current.innerHTML = html;
            else if (!showHtml && editorRef.current) setHtml(editorRef.current.innerHTML);
            setShowHtml((v) => !v);
          }}
        >
          {showHtml ? "Pamje vizuale" : "HTML"}
        </button>
      </div>

      {/* AREA */}
      {showHtml ? (
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="min-h-[320px] w-full resize-y p-4 font-mono text-sm outline-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onBlur={() => { saveSelection(); sync(); }}
          className="min-h-[320px] max-w-none p-4 text-sm leading-relaxed text-brand-navy outline-none [&_a]:text-brand-orange [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-bold [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-xl [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-4"
        />
      )}

      {/* Vlera që dërgohet me formularin */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
