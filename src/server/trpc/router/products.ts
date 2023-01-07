import { PRODUCT_CATEGORY } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const productsRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  }),

  getOne: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({
      where: {
        id: input,
      },
    });
    return product;
  }),

  getUniqueCategories: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      orderBy: {
        category: "asc",
      },
    });
    const categories = products.map((product) => product.category);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories;
  }),

  getByCategory: publicProcedure
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
