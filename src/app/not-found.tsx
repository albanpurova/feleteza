import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <h1 className="font-display text-6xl font-extrabold text-brand-green">404</h1>
      <p className="mt-4 text-brand-navy-light">Faqja që kërkoni nuk u gjet.</p>
      <Link href="/" className="btn-primary mt-8">Kthehu në ballinë</Link>
    </div>
  );
}
