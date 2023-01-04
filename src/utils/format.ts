export const formatCurrency = (
  value: number,
  currency: "USD" | "EUR" | "GBP" | "BDT"
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};

export const truncateText = (str: string, n: number) => {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
};
