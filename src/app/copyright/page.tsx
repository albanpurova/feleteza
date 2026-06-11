export const metadata = { title: "Copyright" };
export default function Page() {
  return (
    <div className="container-x max-w-3xl py-16">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Copyright</h1>
      <p className="mt-4 text-brand-navy-light">© {new Date().getFullYear()} FLETËZA. Të gjitha të drejtat e rezervuara.</p>
    </div>
  );
}
