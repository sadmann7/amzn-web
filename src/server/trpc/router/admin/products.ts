import { PRODUCT_CATEGORY } from "@prisma/client";
import { z } from "zod";
import { adminProcedure, router } from "../../trpc";

export const productsAdminRouter = router({
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(3),
        price: z.number().min(0),
        category: z.nativeEnum(PRODUCT_CATEGORY),
        description: z.string().min(3),
        image: z.string().url(),
        rating: z.number().min(0).max(5),
        quantity: z.number().default(1),
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
          rating: input.rating,
          quantity: input.quantity,
        },
      });
      return product;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        price: z.number(),
        category: z.nativeEnum(PRODUCT_CATEGORY),
        description: z.string(),
        image: z.string(),
        rating: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          price: input.price,
          category: input.category,
          description: input.description,
          image: input.image,
          rating: input.rating,
          quantity: input.quantity,
        },
      });
      return product;
    }),

  delete: adminProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.delete({
      where: {
        id: input,
      },
    });
    return product;
  }),
});
