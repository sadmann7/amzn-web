import { PRODUCT_CATEGORY } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const productsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany();
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

  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number(),
        category: z.nativeEnum(PRODUCT_CATEGORY),
        description: z.string(),
        image: z.string(),
        rating: z.object({
          rate: z.number(),
          count: z.number(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          title: input.title,
          price: input.price,
          category: input.category,
          description: input.description,
          image: input.image,
          rating: {
            create: {
              rate: input.rating.rate,
              count: input.rating.count,
            },
          },
        },
      });
      return product;
    }),
});
