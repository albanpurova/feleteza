"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Paneli", exact: true },
  { href: "/admin/porosite", label: "Porositë" },
  { href: "/admin/produktet", label: "Produktet" },
  { href: "/admin/blog", label: "Blogu" },
  { href: "/admin/kontenti", label: "Kontenti" },
  { href: "/admin/mesazhet", label: "Mesazhet" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Topbar (mobile) */}
      <div className="lg:hidden flex items-center justify-between bg-brand-navy text-white px-4 py-3">
        <span className="font-display font-bold">FLETËZA · Admin</span>
        <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } lg:block bg-brand-navy text-white w-full lg:w-64 lg:min-h-screen lg:fixed lg:top-0 lg:left-0 z-30`}
      >
        <div className="hidden lg:block px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="font-display text-xl font-bold">
            FLETËZA
          </Link>
          <p className="text-white/50 text-xs mt-1">Paneli i administrimit</p>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive(item.href, item.exact)
                  ? "bg-brand-green text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10 lg:absolute lg:bottom-0 lg:w-full">
          <p className="text-white/50 text-xs truncate mb-2">{email}</p>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-white/70 hover:text-white underline"
            >
              Shiko faqen
            </Link>
            <button onClick={logout} className="text-xs text-brand-orange hover:underline ml-auto">
              Dil
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
