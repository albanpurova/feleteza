import { prisma } from "@/lib/prisma";
import { toggleContactHandled, deleteContactMessage } from "@/app/admin/actions-content";

export const dynamic = "force-dynamic";

async function loadMessages() {
  try {
    return await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("[admin] mesazhet:", e);
    return null;
  }
}

export default async function AdminMessagesPage() {
  const messages = await loadMessages();

  if (messages === null) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-4">Mesazhet</h1>
        <p className="text-brand-gray">Nuk u lidh dot me bazën e të dhënave.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-brand-navy">Mesazhet ({messages.length})</h1>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/5 p-6 text-brand-gray">Ende s'ka mesazhe.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-xl border p-5 ${
                m.handled ? "border-black/5 opacity-70" : "border-brand-green/30"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">
                    {m.name || "Pa emër"}{" "}
                    <span className="text-brand-gray font-normal text-sm">· {m.email}</span>
                  </p>
                  {m.phone && <p className="text-brand-gray text-sm">Tel: {m.phone}</p>}
                  <p className="text-brand-gray text-xs mt-1">
                    {new Date(m.createdAt).toLocaleString("sq-AL")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <form action={toggleContactHandled}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="text-sm text-brand-green hover:underline">
                      {m.handled ? "Shëno si i pazgjidhur" : "Shëno si i zgjidhur"}
                    </button>
                  </form>
                  <form action={deleteContactMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="text-sm text-brand-red hover:underline">Fshi</button>
                  </form>
                </div>
              </div>
              <p className="mt-3 text-brand-navy whitespace-pre-wrap bg-black/[0.02] rounded-lg p-3 text-sm">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
