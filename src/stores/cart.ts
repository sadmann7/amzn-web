import type { Product } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type CartState = {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  removeProducts: (ids: number[]) => void;
  setQuantity: (id: number, quantity: number) => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        products: [],
        addProduct: (product) => {
          set((state) => ({
            products: state.products.some((p) => p.id === product.id)
              ? state.products.map((p) =>
                  p.id === product.id
                    ? {
                        ...p,
                        quantity: p.quantity + 1,
                      }
                    : p
                )
              : [...state.products, { ...product, quantity: 1 }],
          }));
        },
        removeProduct: (id: number) => {
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
          }));
        },
        removeProducts: (ids: number[]) => {
          set((state) => ({
            products: state.products.filter(
              (product) => !ids.includes(product.id)
            ),
          }));
        },
        setQuantity: (id: number, quantity: number) => {
          set((state) => ({
            products: state.products.map((product) => {
              if (product.id === id) {
                return {
                  ...product,
                  quantity,
                };
              }
              return product;
            }),
          }));
        },
      }),
      {
        name: "cart",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
