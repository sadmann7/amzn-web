export const formatCurrency = (
  value: number,
  currency: "USD" | "EUR" | "GBP" | "BDT"
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};
