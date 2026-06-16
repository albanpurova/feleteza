import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produktet" };

export default async function ProduktetPage() {
  const products = await getAllProducts();
  return (
    <div className="container-x py-14">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Produktet tona</h1>
      <p className="mt-2 text-brand-gray">Karta edukative të krijuara nga ekspertë të zhvillimit të hershëm.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            p={{ productId: p.id, slug: p.slug, name: p.name, price: p.price.toString(), image: p.images[0]?.url ?? null, freeShipping: p.freeShipping }}
          />
        ))}
      </div>
    </div>
  );
}
