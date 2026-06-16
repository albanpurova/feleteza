"use client";

import Link from "next/link";
import { formatEuro } from "@/lib/format";
import { useCart } from "@/components/CartProvider";

export type ProductCardData = {
  productId: string;
  slug: string;
  name: string;
  price: string;
  image: string | null;
  freeShipping?: boolean;
};

export default function ProductCard({ p }: { p: ProductCardData }) {
  const { addItem } = useCart();

  function add() {
    addItem({
      productId: p.productId,
      slug: p.slug,
      name: p.name,
      price: parseFloat(p.price),
      image: p.image || undefined,
      freeShipping: p.freeShipping ?? false,
    });
  }

  return (
    <div className="group flex flex-col rounded-2xl bg-white p-3 transition hover:shadow-lg">
      <Link href={`/produkti/${p.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-brand-cream">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image}
              alt=""
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-gray">Imazh</div>
          )}
        </div>
        <h3 className="mt-3 text-sm font-bold text-brand-navy">{p.name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-orange">{formatEuro(p.price)}</p>
      </Link>

      <button
        onClick={add}
        className="btn-primary mt-3 w-full justify-center"
      >
        Shto në shportë
      </button>
    </div>
  );
}
