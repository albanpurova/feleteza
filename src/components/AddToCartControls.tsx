"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";

type Props = {
  product: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    image: string | null;
    freeShipping?: boolean;
    stock?: number;
  };
};

export default function AddToCartControls({ product }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const outOfStock = (product.stock ?? 1) <= 0;

  const item = {
    productId: product.productId,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image || undefined,
    freeShipping: product.freeShipping ?? false,
  };

  if (outOfStock) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-brand-red/10 px-4 py-2 text-base font-semibold text-brand-red">
          Ky produkt nuk ka stok për momentin
        </span>
        <button disabled className="btn-primary cursor-not-allowed opacity-50">
          Shto në shportë
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-lg border border-gray-200">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-brand-navy">−</button>
        <span className="w-10 text-center font-semibold">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2.5 text-brand-navy">+</button>
      </div>

      <button onClick={() => addItem(item, qty)} className="btn-outline">
        Shto në shportë
      </button>

      <button
        onClick={() => {
          addItem(item, qty);
          router.push("/shporta");
        }}
        className="btn-primary"
      >
        Blej tani
      </button>
    </div>
  );
}
