import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const ordersRouter = router({
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
});
