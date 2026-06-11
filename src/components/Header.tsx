"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { useCart } from "./CartProvider";

const navLinks = [
  { label: "Pse Fletëza?", href: "/#pse-fleteza" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-brand-navy transition hover:text-brand-green"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/produktet" className="btn-primary !px-6 !py-2.5 uppercase tracking-wide">
            Produktet
          </Link>
          <span className="h-6 w-px bg-gray-200" />
          <CartButton count={count} onClick={() => setOpen(true)} />
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-4 lg:hidden">
          <CartButton count={count} onClick={() => setOpen(true)} />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="text-brand-navy"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-1 text-base font-semibold text-brand-navy"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/produktet"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-2 uppercase"
            >
              Produktet
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative text-brand-navy transition hover:text-brand-green" aria-label="Shporta">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 3h2l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3h8.7a1.5 1.5 0 0 0 1.5-1.2l1.6-7.8H6" />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
