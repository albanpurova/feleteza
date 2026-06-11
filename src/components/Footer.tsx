"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !message) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (res.ok) {
        setSent(true);
        setEmail("");
        setMessage("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="mt-20 bg-[#eef3f2]">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-brand-gray">
            Materiale edukative për zhvillimin e hershëm të fëmijëve.
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-sm font-semibold text-brand-navy">
          <Link href="/produktet" className="hover:text-brand-green">Produktet</Link>
          <Link href="/#pse-fleteza" className="hover:text-brand-green">Pse Fletëza?</Link>
          <Link href="/#reviews" className="hover:text-brand-green">Reviews</Link>
          <Link href="/blog" className="hover:text-brand-green">Blog</Link>
        </nav>

        <div>
          <h4 className="mb-3 font-bold text-brand-navy">Na kontaktoni</h4>
          {sent ? (
            <p className="text-sm text-brand-green">Faleminderit! Mesazhi u dërgua.</p>
          ) : (
            <div className="space-y-2">
              <input
                className="w-full rounded-md border-0 bg-white px-3 py-2 text-sm outline-none"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                className="w-full rounded-md border-0 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Mesazhi"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={submit} disabled={loading} className="btn-primary !px-6 !py-2 disabled:opacity-60">
                {loading ? "..." : "Dërgo"}
              </button>
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-3 font-bold text-brand-navy">Follow us:</h4>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-green text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.1 3.3c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-3.3s0-2.1-.1-3.3c-.1-1.1-.2-1.7-.4-2.1a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.2-8.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-green text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.6v8h3.3z"/></svg>
            </a>
          </div>
          <p className="mt-4 text-sm text-brand-gray">info@fleteza.com</p>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-brand-gray sm:flex-row">
          <div className="flex gap-5">
            <Link href="/copyright" className="hover:text-brand-green">Copyright</Link>
            <Link href="/privacy" className="hover:text-brand-green">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-green">Terms &amp; Conditions</Link>
          </div>
          <span>
            Powered by <strong className="text-brand-navy">TROKIT</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}
