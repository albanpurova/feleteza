import { prisma } from "@/lib/prisma";
import { formatEuro } from "@/lib/format";
import { updateOrderStatus, deleteOrder } from "@/app/admin/actions-content";
import StatusSelect from "@/components/StatusSelect";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Në pritje" },
  { value: "CONFIRMED", label: "Konfirmuar" },
  { value: "SHIPPED", label: "Dërguar" },
  { value: "DELIVERED", label: "Dorëzuar" },
  { value: "CANCELLED", label: "Anuluar" },
];

async function loadOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch (e) {
    console.error("[admin] porosite:", e);
    return null;
  }
}

export default async function AdminOrdersPage() {
  const orders = await loadOrders();

  if (orders === null) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-4">Porositë</h1>
        <p className="text-brand-gray">Nuk u lidh dot me bazën e të dhënave.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-brand-navy">Porositë ({orders.length})</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/5 p-6 text-brand-gray">Ende s'ka porosi.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl border border-black/5 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-black/5 bg-black/[0.02]">
                <div>
                  <span className="font-display font-bold text-brand-navy">{o.orderNumber}</span>
                  <span className="text-brand-gray text-xs ml-3">
                    {new Date(o.createdAt).toLocaleString("sq-AL")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <form action={updateOrderStatus}>
                    <input type="hidden" name="id" value={o.id} />
                    <StatusSelect name="status" defaultValue={o.status} options={STATUS_OPTIONS} />
                  </form>
                  <form action={deleteOrder}>
                    <input type="hidden" name="id" value={o.id} />
                    <button className="text-xs text-brand-red hover:underline" type="submit">
                      Fshi
                    </button>
                  </form>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-5">
                <div className="text-sm space-y-1">
                  <h3 className="font-semibold text-brand-navy mb-2">Klienti</h3>
                  <p className="text-brand-gray">
                    <span className="text-brand-navy">{o.firstName} {o.lastName}</span>
                  </p>
                  <p className="text-brand-gray">Tel: {o.phone}</p>
                  {o.email && <p className="text-brand-gray">Email: {o.email}</p>}
                  <p className="text-brand-gray">
                    Adresa: {o.address}, {o.city}, {o.country}
                  </p>
                  {o.note && <p className="text-brand-gray italic">Shënim: {o.note}</p>}
                  <p className="text-brand-gray">Pagesa: Para në dorëzim (COD)</p>
                </div>

                <div className="text-sm">
                  <h3 className="font-semibold text-brand-navy mb-2">Artikujt</h3>
                  <table className="w-full">
                    <tbody>
                      {o.items.map((it) => (
                        <tr key={it.id} className="border-b border-black/5 last:border-0">
                          <td className="py-1.5 text-brand-navy">{it.name}</td>
                          <td className="py-1.5 text-brand-gray text-center">×{it.quantity}</td>
                          <td className="py-1.5 text-right text-brand-navy">
                            {formatEuro(Number(it.price) * it.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between mt-3 pt-3 border-t border-black/10 font-bold text-brand-navy">
                    <span>TOTAL</span>
                    <span>{formatEuro(Number(o.total))}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
