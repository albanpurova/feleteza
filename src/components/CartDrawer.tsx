"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatEuro } from "@/lib/format";

export default function CartDrawer() {
  const { items, isOpen, setOpen, updateQty, removeItem, subtotal, count } = useCart();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-display text-lg font-bold text-brand-navy">
            Shporta {count > 0 && `(${count})`}
          </h3>
          <button onClick={() => setOpen(false)} aria-label="Mbyll" className="text-brand-gray hover:text-brand-navy">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-brand-gray">Shporta është bosh.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((i) => (
                <li key={i.productId} className="flex gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                    {i.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.image} alt={i.name} className="h-full w-full object-contain" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-brand-navy">{i.name}</span>
                      <button onClick={() => removeItem(i.productId)} className="text-xs text-brand-gray hover:text-brand-red">
                        Hiq
                      </button>
                    </div>
                    <span className="text-sm text-brand-orange">{formatEuro(i.price)}</span>
                    <div className="mt-2 flex w-fit items-center rounded-lg border border-gray-200">
                      <button onClick={() => updateQty(i.productId, i.quantity - 1)} className="px-3 py-1 text-brand-navy">−</button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <button onClick={() => updateQty(i.productId, i.quantity + 1)} className="px-3 py-1 text-brand-navy">+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t px-6 py-5">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-brand-gray">Nëntotali</span>
              <span className="font-bold text-brand-navy">{formatEuro(subtotal)}</span>
            </div>
            <Link href="/shporta" onClick={() => setOpen(false)} className="btn-teal w-full">
              Vazhdo te blerja
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
