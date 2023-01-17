import type { Prisma } from "@prisma/client";
import { USER_ROLE } from "@prisma/client";
import { z } from "zod";
import { adminProcedure, router } from "../../trpc";

export const usersAdminRouter = router({
  getUsers: adminProcedure
    .input(
      z.object({
        page: z.number().int().default(0),
        perPage: z.number().int().default(10),
        email: z.string().optional(),
        name: z.string().optional(),
        active: z.boolean().optional(),
        role: z.nativeEnum(USER_ROLE).optional(),
        sortBy: z
          .enum(["email", "name", "role", "active", "createdAt"])
          .optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const needFilter = input.email || input.name || input.role;

      const params: Prisma.UserFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
        where: needFilter
          ? {
              AND: {
                email: input.email ? { contains: input.email } : undefined,
                name: input.name ? { contains: input.name } : undefined,
                role: input.role,
              },
            }
          : undefined,
      };

      const [count, users] = await ctx.prisma.$transaction([
        ctx.prisma.user.count({ where: params.where }),
        ctx.prisma.user.findMany({
          ...params,
          skip: input.page * input.perPage,
          take: input.perPage,
        }),
      ]);
      return { count, users };
    }),

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
