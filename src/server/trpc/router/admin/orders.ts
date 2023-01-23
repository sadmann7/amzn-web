import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { adminProcedure, router } from "../../trpc";

export const ordersAdminRouter = router({
  getOrders: adminProcedure
    .input(
      z.object({
        page: z.number().int().default(0),
        perPage: z.number().int().default(10),
        sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const params: Prisma.OrderFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
      };

      const [count, orders] = await ctx.prisma.$transaction([
        ctx.prisma.order.count({ where: params.where }),
        ctx.prisma.order.findMany({
          ...params,
          skip: input.page * input.perPage,
          take: input.perPage,
          include: {
            user: true,
          },
        }),
      ]);
      return { count, orders };
    }),

  getOrder: adminProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: { id: input },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return order;
  }),

  deleteOrder: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.delete({
        where: {
          id: input,
        },
      });
      if (!order) {
        throw new Error("Order not found!");
      }
      return order;
    }),

  deleteItem: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const orderItem = await ctx.prisma.orderItem.delete({
        where: {
          id: input,
        },
      });
      if (!orderItem) {
        throw new Error("Order item not found!");
      }
      const orderItems = await ctx.prisma.orderItem.findMany({
        where: {
          orderId: orderItem.orderId,
        },
      });
      if (orderItems.length === 0) {
        await ctx.prisma.order.delete({
          where: {
            id: orderItem.orderId,
          },
        });
      }
      return orderItem;
    }),
});
