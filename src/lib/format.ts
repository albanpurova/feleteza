export function formatEuro(value: number | string): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  const safe = isNaN(n) ? 0 : n;
  // Formatim deterministik (i njëjtë në server dhe shfletues) → shmang gabimin e hidratimit.
  // Stili shqip: pikë për mijëshet, presje për decimalet, € pas shumës. P.sh. 1.234,56 €
  const fixed = Math.abs(safe).toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const sign = safe < 0 ? "-" : "";
  return `${sign}${withThousands},${decPart} €`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function genOrderNumber(): string {
  const d = new Date();
  const stamp =
    d.getFullYear().toString().slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FL-${stamp}-${rand}`;
}
