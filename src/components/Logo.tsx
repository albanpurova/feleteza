import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="FLETËZA — ballina">
      <span
        className="font-display text-2xl font-extrabold tracking-tight text-brand-green sm:text-[28px]"
      >
        <Image 
          src="/images/logo.png"
          alt="FLETËZA"
          width={130}
          height={40}
          className="ml-2"
        />
      </span>
    </Link>
  );
}
