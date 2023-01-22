import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const ordersRouter = router({
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany();
    return orders;
  }),

  getCurrentUserOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return orders;
  }),

  getOrder: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input,
        },
      });
      if (!order) {
        throw new Error("Order not found!");
      }
      return order;
    }),

  getItems: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const orderItems = await ctx.prisma.orderItem.findMany({
        where: {
          orderId: input,
        },
        include: {
          product: true,
        },
      });
      if (!orderItems) {
        throw new Error("Order not found!");
      }
      return orderItems;
    }),

  getCurrentUserItems: protectedProcedure.query(async ({ ctx }) => {
    const orderItems = await ctx.prisma.orderItem.findMany({
      where: {
        order: {
          userId: ctx.session.user.id,
        },
      },
      include: {
        product: true,
      },
    });
    if (!orderItems) {
      throw new Error("Order not found!");
    }
    return orderItems;
  }),

  addOrder: protectedProcedure
    .input(
      z.array(
        z.object({
          productId: z.number(),
          productQuantity: z.number(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.create({
        data: {
          userId: ctx.session.user.id,
        },
      });
      if (!order) {
        throw new Error("Order not found!");
      }
      const orderItems = await Promise.all(
        input.map(async ({ productId, productQuantity }) => {
          const product = await ctx.prisma.product.findUnique({
            where: {
              id: productId,
            },
          });
          if (!product) {
            throw new Error("Product not found!");
          }
          const orderItem = await ctx.prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              quantity: productQuantity,
            },
          });
          return orderItem;
        })
      );
      return orderItems;
    }),

  archiveItem: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        archived: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const orderItem = await ctx.prisma.orderItem.update({
        where: {
          id: input.id,
        },
        data: {
          archived: !input.archived,
        },
      });
      return orderItem;
    }),

  archiveOrder: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        archived: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          archived: !input.archived,
        },
      });
      return order;
    }),
});
