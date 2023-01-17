import type { Product } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type CartState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  removeById: (id: number) => void;
  removeManyById: (ids: number[]) => void;
  setQuantity: (id: number, quantity: number) => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        products: [],
        setProducts: (products: Product[]) => set({ products }),
        removeById: (id: number) => {
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
          }));
        },
        removeManyById: (ids: number[]) => {
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
