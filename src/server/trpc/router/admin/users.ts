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
        name: z.string().optional(),
        email: z.string().optional(),
        role: z.nativeEnum(USER_ROLE).optional(),
        active: z.boolean().optional(),
        sortBy: z
          .enum(["email", "name", "role", "active", "createdAt"])
          .optional(),
        sortDesc: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const needFilter = input.name || input.email || input.role;

      const params: Prisma.UserFindManyArgs = {
        orderBy: input.sortBy
          ? { [input.sortBy]: input.sortDesc ? "desc" : "asc" }
          : undefined,
        where: needFilter
          ? {
              AND: {
                name: input.name ? { contains: input.name } : undefined,
                email: input.email ? { contains: input.email } : undefined,
                role: input.role ? { equals: input.role } : undefined,
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
