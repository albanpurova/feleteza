// Logjika e transportit — përdoret njësoj nga klienti (shporta) dhe serveri (api/orders)

export const SHIPPING_FEE = 3; // € për Shqipëri dhe Maqedoninë e Veriut
export const COUNTRY_KOSOVO = "Kosovë";
export const COUNTRY_ALBANIA = "Shqipëri";
export const COUNTRY_MACEDONIA = "Maqedonia e Veriut";

export const SHIPPING_COUNTRIES = [COUNTRY_KOSOVO, COUNTRY_ALBANIA, COUNTRY_MACEDONIA];

type ShipItem = { freeShipping?: boolean; quantity?: number };

/**
 * Rregulli:
 * - Kosovë: gjithmonë falas.
 * - Shqipëri / Maqedoni: falas vetëm nëse TË GJITHA produktet kanë freeShipping=true;
 *   nëse ka të paktën një produkt me pagesë transporti → tarifë e sheshtë prej SHIPPING_FEE.
 */
export function calcShipping(country: string, items: ShipItem[]): number {
  if (!country || country === COUNTRY_KOSOVO) return 0;
  if (country === COUNTRY_ALBANIA || country === COUNTRY_MACEDONIA) {
    const hasPaid = items.some((i) => !i.freeShipping);
    return hasPaid ? SHIPPING_FEE : 0;
  }
  return 0;
}
