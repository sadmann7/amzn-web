import type { Prisma } from "@prisma/client";
import { PRODUCT_CATEGORY } from "@prisma/client";
import { z } from "zod";
import { adminProcedure, router } from "../../trpc";

export const productsAdminRouter = router({
  getProducts: adminProcedure
    .input(
      z.object({
        page: z.number().int().default(0),
        perPage: z.number().int().default(10),
        title: z.string().optional(),
        rating: z.number().optional(),
        sortBy: z
          .enum([
            "title",
            "category",
            "quantity",
            "price",
            "rating",
            "createdAt",
          ])
          .optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const needFilter = input.rating || input.title;

      const params: Prisma.ProductFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
        where: needFilter
          ? {
              AND: {
                title: input.title ? { contains: input.title } : undefined,
                rating: input.rating ? { equals: input.rating } : undefined,
              },
            }
          : undefined,
      };

      const [count, products] = await ctx.prisma.$transaction([
        ctx.prisma.product.count({ where: params.where }),
        ctx.prisma.product.findMany({
          ...params,
          skip: input.page * input.perPage,
          take: input.perPage,
        }),
      ]);
      return { count, products };
    }),

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
