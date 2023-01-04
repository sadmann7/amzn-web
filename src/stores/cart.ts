import type { Product } from "@prisma/client";
import create from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type CartState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  removeById: (id: number) => void;
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
      }),
      {
        name: "cart",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
