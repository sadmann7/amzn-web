import { USER_ROLE } from "@prisma/client";
import { z } from "zod";
import { adminProcedure, router } from "../../trpc";

export const usersAdminRouter = router({
  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.nativeEnum(USER_ROLE),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: input.role,
        },
      });
      return user;
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          active: input.status,
        },
      });
      return user;
    }),
});
