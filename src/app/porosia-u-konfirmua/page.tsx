import Link from "next/link";

export const metadata = { title: "Porosia u konfirmua" };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ nr?: string }>;
}) {
  const { nr } = await searchParams;
  return (
    <div className="container-x py-24 text-center">
      <div className="mx-auto mb-6 text-5xl">🐝</div>
      <h1 className="font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
        Porosia juaj u pranua me sukses!
      </h1>
      {nr && (
        <p className="mt-3 text-brand-gray">
          Numri i porosisë: <strong className="text-brand-navy">{nr}</strong>
        </p>
      )}
      <p className="mx-auto mt-4 max-w-xl text-brand-navy-light">
        Porositë për Kosovë dorëzohen brenda <strong>1–2 ditëve pune</strong>, ndërsa për Shqipëri dhe
        Maqedoni të Veriut brenda <strong>3–5 ditëve pune</strong>.
      </p>
      <Link href="/produktet" className="btn-primary mt-8">
        Vazhdo blerjen e radhës
      </Link>
    </div>
  );
}
