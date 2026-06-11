import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEuro } from "@/lib/format";
import { toggleProductFlag, deleteProduct } from "@/app/admin/actions-products";

export const dynamic = "force-dynamic";

async function loadProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    });
  } catch (e) {
    console.error("[admin] produktet:", e);
    return null;
  }
}

export default async function AdminProductsPage() {
  const products = await loadProducts();

  if (products === null) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-4">Produktet</h1>
        <p className="text-brand-gray">Nuk u lidh dot me bazën e të dhënave.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-brand-navy">Produktet ({products.length})</h1>
        <Link href="/admin/produktet/new" className="btn-primary text-sm">
          + Shto produkt
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-black/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-brand-gray border-b border-black/5">
              <th className="px-5 py-3 font-medium">Produkti</th>
              <th className="px-5 py-3 font-medium text-right">Çmimi</th>
              <th className="px-5 py-3 font-medium text-right">Stoku</th>
              <th className="px-5 py-3 font-medium text-center">Aktiv</th>
              <th className="px-5 py-3 font-medium text-center">Në homepage</th>
              <th className="px-5 py-3 font-medium text-right">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/produktet/${p.id}`} className="font-medium text-brand-navy hover:text-brand-green">
                    {p.name}
                  </Link>
                  <div className="text-brand-gray text-xs">/{p.slug}</div>
                </td>
                <td className="px-5 py-3 text-right text-brand-navy">{formatEuro(Number(p.price))}</td>
                <td className="px-5 py-3 text-right">
                  <span className={p.stock <= 5 ? "text-brand-red font-semibold" : "text-brand-navy"}>{p.stock}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  <form action={toggleProductFlag} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="active" />
                    <button type="submit" className="text-lg" title="Ndrysho">
                      {p.active ? "✅" : "⬜"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-3 text-center">
                  <form action={toggleProductFlag} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="featured" />
                    <button type="submit" className="text-lg" title="Ndrysho">
                      {p.featured ? "⭐" : "☆"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                  <Link href={`/admin/produktet/${p.id}`} className="text-brand-green hover:underline">
                    Edito
                  </Link>
                  <form action={deleteProduct} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-brand-red hover:underline">
                      Fshi
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
