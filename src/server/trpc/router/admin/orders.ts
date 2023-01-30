import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, router } from "../../trpc";

export const ordersAdminRouter = router({
  get: adminProcedure
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

  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
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
    if (!order) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found!",
      });
    }
    return order;
  }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.delete({
      where: {
        id: input,
      },
    });
    if (!order) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found!",
      });
    }
    return order;
  }),

  deleteItem: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const orderItem = await ctx.prisma.orderItem.delete({
        where: {
          id: input,
        },
      });
      if (!orderItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order item not found!",
        });
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

  prev: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: { id: input },
    });
    if (!order) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found!",
      });
    }
    const prevOrder = await ctx.prisma.order.findFirst({
      where: {
        createdAt: {
          lt: order.createdAt,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!prevOrder) {
      const lastOrder = await ctx.prisma.order.findFirst({
        orderBy: {
          createdAt: "desc",
        },
      });
      return lastOrder;
    }
    return prevOrder;
  }),

  next: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: { id: input },
    });
    if (!order) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found!",
      });
    }
    const nextOrder = await ctx.prisma.order.findFirst({
      where: {
        createdAt: {
          gt: order.createdAt,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (!nextOrder) {
      const firstOrder = await ctx.prisma.order.findFirst({
        orderBy: {
          createdAt: "asc",
        },
      });
      return firstOrder;
    }
    return nextOrder;
  }),
});
