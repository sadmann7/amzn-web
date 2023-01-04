export const formatCurrency = (
  value: number,
  currency: "USD" | "EUR" | "GBP" | "BDT"
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};

export const formatEnum = (str: string) => {
  const words = str.split("_");
  const formattedWords = words.map((word) => {
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
  return formattedWords.join(" ");
};

export const truncateText = (str: string, n: number) => {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
};
