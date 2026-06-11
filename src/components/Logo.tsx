import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="FLETËZA — ballina">
      <span
        className="font-display text-2xl font-extrabold tracking-tight text-brand-green sm:text-[28px]"
        style={{ transform: "rotate(-2deg)" }}
      >
        FLETËZA
      </span>
    </Link>
  );
}
