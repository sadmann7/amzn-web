import type { Prisma } from "@prisma/client";
import { USER_ROLE } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, router } from "../../trpc";

export const usersAdminRouter = router({
  get: adminProcedure
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

  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
    });
    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found!",
      });
    return user;
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3).max(50),
        email: z.string().email(),
        phone: z.string().min(10).max(11),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
        },
      });
      return user;
    }),

  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.nativeEnum(USER_ROLE),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!currentUser)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found!",
        });
      if (currentUser.role !== USER_ROLE.ADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can change roles!",
        });
      }
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
      const currentUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!currentUser)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found!",
        });
      if (currentUser.role !== USER_ROLE.ADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can change status!",
        });
      }
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

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.delete({
      where: {
        id: input,
      },
    });
    return user;
  }),

  prev: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
    });
    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found!",
      });
    const prevUser = await ctx.prisma.user.findFirst({
      where: {
        id: {
          lt: user.id,
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    if (!prevUser) {
      const lastUser = await ctx.prisma.user.findFirst({
        orderBy: {
          id: "desc",
        },
      });
      return lastUser;
    }
    return prevUser;
  }),

  next: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
    });
    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found!",
      });
    const nextUser = await ctx.prisma.user.findFirst({
      where: {
        id: {
          gt: user.id,
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    if (!nextUser) {
      const firstUser = await ctx.prisma.user.findFirst({
        orderBy: {
          id: "asc",
        },
      });
      return firstUser;
    }
    return nextUser;
  }),
});
