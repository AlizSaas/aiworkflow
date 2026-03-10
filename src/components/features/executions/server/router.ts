import { PAGINATION } from "@/config/constants";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { prisma } from "@/lib/db";
import z from "zod";

export const executionsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        workflowId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, workflowId } = input;

      const where = {
        userId: ctx.auth.user.id,
        ...(workflowId ? { workflowId } : {}),
      };

      const [items, totalCount] = await Promise.all([
        prisma.workflowExecution.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: { createdAt: "desc" },
          include: {
            workflow: { select: { name: true } },
          },
        }),
        prisma.workflowExecution.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.workflowExecution.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.auth.user.id },
        include: {
          workflow: { select: { name: true } },
          logs: { orderBy: { startedAt: "asc" } },
        },
      });
    }),
});
