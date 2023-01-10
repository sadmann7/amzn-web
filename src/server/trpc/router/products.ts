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

  addItem: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: {
          id: input,
        },
      });
      if (!product) {
        throw new Error("Product not found");
      }
      const order = await ctx.prisma.order.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (!order) {
        throw new Error("Order not found");
      }
      const orderItem = await ctx.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: 1,
        },
      });
      return orderItem;
    }),

  addItems: protectedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.create({
        data: {
          userId: ctx.session.user.id,
        },
      });
      if (!order) {
        throw new Error("Order not found");
      }
      const orderItems = await Promise.all(
        input.map(async (productId) => {
          const product = await ctx.prisma.product.findUnique({
            where: {
              id: productId,
            },
          });
          if (!product) {
            throw new Error("Product not found");
          }
          const orderItem = await ctx.prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              quantity: 1,
            },
          });
          return orderItem;
        })
      );
      return orderItems;
    }),
});
