import { env } from "@/env/client.mjs";

export const getProducts = async () => {
  const res = await fetch(env.NEXT_PUBLIC_PRODUCTS_GET);
  const data = await res.json();
  return data;
};

export const getProduct = async (productId: number) => {
  const res = await fetch(`${env.NEXT_PUBLIC_PRODUCTS_GET}/${productId}`);
  const data = await res.json();
  return data;
};
