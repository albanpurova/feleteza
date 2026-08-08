import { Children } from "react";

/**
 * Në mobile: rrëshqitje horizontale me "snap" dhe boxi tjetër duket pjesërisht djathtas (peek).
 * Në desktop (md+): kthehet në grid normal.
 *
 * desktop  = klasat e grid-it për desktop, p.sh. "md:grid-cols-3"
 * item     = gjerësia e çdo boxi në mobile (basis), p.sh. "basis-[80%] sm:basis-[46%]"
 */
export default function Carousel({
  children,
  desktop,
  item = "basis-[80%] sm:basis-[48%]",
  className = "",
}: {
  children: React.ReactNode;
  desktop: string;
  item?: string;
  className?: string;
}) {
  return (
    <div
      className={`no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:gap-6 md:overflow-visible md:px-0 md:pb-0 ${desktop} ${className}`}
    >
      {Children.map(children, (child, i) => (
        <div key={i} className={`shrink-0 snap-start ${item} md:shrink md:basis-auto`}>
          {child}
        </div>
      ))}
    </div>
  );
}
