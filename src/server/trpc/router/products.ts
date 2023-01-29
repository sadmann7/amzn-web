import { PRODUCT_CATEGORY } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const productsRouter = router({
  getProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  }),

  getProduct: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: {
          id: input,
        },
      });
      return product;
    }),

  getUniqueCategories: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany();
    const categories = products.map((product) => product.category);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories;
  }),

  getProductsByCategory: publicProcedure
    .input(z.nativeEnum(PRODUCT_CATEGORY))
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          category: input,
        },
      });
      return products;
    }),
});
