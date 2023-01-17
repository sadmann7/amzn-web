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

  getPaginatedProducts: publicProcedure
    .input(
      z.object({
        page: z.number().min(1),
        limit: z.number().min(1),
        sortBy: z.string().optional(),
        sortDirection: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sortBy, sortDirection } = input;
      const offset = (page - 1) * limit;
      const products = await ctx.prisma.product.findMany({
        orderBy: {
          [sortBy || "createdAt"]: sortDirection || "desc",
        },
        skip: offset,
        take: limit,
      });
      return products;
    }),

  getProduct: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
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
