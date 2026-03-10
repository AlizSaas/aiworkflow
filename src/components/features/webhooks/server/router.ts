import { PAGINATION } from "@/config/constants";
import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import z from "zod";

export const webhooksRouter = createTRPCRouter({
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
        prisma.webhook.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: { createdAt: "desc" },
          include: {
            workflow: { select: { name: true } },
          },
        }),
        prisma.webhook.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        name: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the workflow belongs to the user
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.workflowId, userId: ctx.auth.user.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      const secret = randomBytes(32).toString("hex");

      return prisma.webhook.create({
        data: {
          workflowId: input.workflowId,
          userId: ctx.auth.user.id,
          name: input.name,
          secret,
        },
        include: {
          workflow: { select: { name: true } },
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.webhook.delete({
        where: { id: input.id, userId: ctx.auth.user.id },
      });
    }),
});
