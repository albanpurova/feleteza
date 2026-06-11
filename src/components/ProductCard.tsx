import Link from "next/link";
import { formatEuro } from "@/lib/format";

export type ProductCardData = {
  slug: string;
  name: string;
  price: string;
  image: string | null;
};

export default function ProductCard({ p }: { p: ProductCardData }) {
  return (
    <Link
      href={`/produkti/${p.slug}`}
      className="group block rounded-2xl bg-white p-3 transition hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-brand-cream">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-gray">Imazh</div>
        )}
      </div>
      <h3 className="mt-3 text-sm font-bold text-brand-navy">{p.name}</h3>
      <p className="mt-1 text-sm font-semibold text-brand-orange">{formatEuro(p.price)}</p>
    </Link>
  );
}
