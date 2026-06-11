import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEuro } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Në pritje",
  CONFIRMED: "Konfirmuar",
  SHIPPED: "Dërguar",
  DELIVERED: "Dorëzuar",
  CANCELLED: "Anuluar",
};

async function loadStats() {
  try {
    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [orderCount, pendingCount, revenueAgg, revenue30Agg, recentOrders, products, items] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: { not: "CANCELLED" } },
        }),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { status: { not: "CANCELLED" }, createdAt: { gte: last30 } },
        }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          include: { items: true },
        }),
        prisma.product.findMany({ orderBy: { stock: "asc" } }),
        prisma.orderItem.groupBy({
          by: ["name"],
          _sum: { quantity: true, price: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        }),
      ]);

    return {
      ok: true as const,
      orderCount,
      pendingCount,
      revenue: Number(revenueAgg._sum.total ?? 0),
      revenue30: Number(revenue30Agg._sum.total ?? 0),
      recentOrders,
      products,
      topProducts: items,
    };
  } catch (e) {
    console.error("[admin] dashboard:", e);
    return { ok: false as const };
  }
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-black/5 p-5">
      <p className="text-brand-gray text-sm">{label}</p>
      <p className={`text-2xl font-display font-bold mt-1 ${accent || "text-brand-navy"}`}>{value}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const s = await loadStats();

  if (!s.ok) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-4">Paneli</h1>
        <div className="bg-white rounded-xl border border-black/5 p-6 text-brand-gray">
          Nuk u lidh dot me bazën e të dhënave. Sigurohuni që PostgreSQL është aktiv dhe që keni
          ekzekutuar migrimet (<code className="bg-black/5 px-1 rounded">npm run db:migrate</code>) dhe
          seed-in (<code className="bg-black/5 px-1 rounded">npm run db:seed</code>).
        </div>
      </div>
    );
  }

  const lowStock = s.products.filter((p) => p.stock <= 5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-display font-bold text-brand-navy">Paneli</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Porosi gjithsej" value={String(s.orderCount)} />
        <StatCard label="Në pritje" value={String(s.pendingCount)} accent="text-brand-orange" />
        <StatCard label="Të ardhura (30 ditë)" value={formatEuro(s.revenue30)} accent="text-brand-green" />
        <StatCard label="Të ardhura gjithsej" value={formatEuro(s.revenue)} accent="text-brand-green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Porositë e fundit */}
        <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <h2 className="font-display font-bold text-brand-navy">Porositë e fundit</h2>
            <Link href="/admin/porosite" className="text-sm text-brand-green hover:underline">
              Të gjitha
            </Link>
          </div>
          {s.recentOrders.length === 0 ? (
            <p className="p-5 text-brand-gray text-sm">Ende s'ka porosi.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {s.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3">
                      <Link href="/admin/porosite" className="font-medium text-brand-navy">
                        {o.orderNumber}
                      </Link>
                      <div className="text-brand-gray text-xs">
                        {o.firstName} {o.lastName}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-brand-gray text-xs">{STATUS_LABEL[o.status]}</td>
                    <td className="px-5 py-3 text-right font-semibold text-brand-navy">
                      {formatEuro(Number(o.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Produktet më të shitura */}
        <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-black/5">
            <h2 className="font-display font-bold text-brand-navy">Produktet më të shitura</h2>
          </div>
          {s.topProducts.length === 0 ? (
            <p className="p-5 text-brand-gray text-sm">Ende s'ka shitje.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {s.topProducts.map((t) => (
                  <tr key={t.name} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3 text-brand-navy">{t.name}</td>
                    <td className="px-5 py-3 text-right text-brand-gray">
                      {t._sum.quantity ?? 0} copë
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Raporti i stokut */}
      <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="font-display font-bold text-brand-navy">Raporti i stoqeve</h2>
          {lowStock.length > 0 && (
            <span className="text-xs bg-brand-red/10 text-brand-red px-2 py-1 rounded-full">
              {lowStock.length} produkt me stok të ulët
            </span>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-brand-gray border-b border-black/5">
              <th className="px-5 py-3 font-medium">Produkti</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium text-right">Çmimi</th>
              <th className="px-5 py-3 font-medium text-right">Stoku</th>
            </tr>
          </thead>
          <tbody>
            {s.products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-5 py-3 text-brand-navy">{p.name}</td>
                <td className="px-5 py-3 text-brand-gray text-xs">{p.sku || "—"}</td>
                <td className="px-5 py-3 text-right text-brand-navy">{formatEuro(Number(p.price))}</td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`font-semibold ${
                      p.stock <= 5 ? "text-brand-red" : p.stock <= 20 ? "text-brand-orange" : "text-brand-green"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
