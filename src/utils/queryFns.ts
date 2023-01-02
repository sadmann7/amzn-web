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

export const getCategories = async () => {
  const res = await fetch(env.NEXT_PUBLIC_CATEGORIES_GET);
  const data = await res.json();
  return data;
};

export const getProductsByCategory = async (category: string) => {
  const res = await fetch(
    `${env.NEXT_PUBLIC_PRODUCTS_GET}/category/${category}`
  );
  const data = await res.json();
  return data;
};
