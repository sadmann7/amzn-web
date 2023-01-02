export function formatCurrency(
  value: number,
  currency: "USD" | "EUR" | "GBP" | "BDT"
) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency,
  }).format(value);
}
