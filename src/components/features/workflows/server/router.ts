import { prisma } from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import {generateSlug} from 'random-word-slugs'
import z from "zod";

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(({ctx}) => {
        return prisma.workflow.create({
            data:{
                name: generateSlug(5),
                userId: ctx.auth.user.id
            }
        })

    }),

    remove:protectedProcedure
    .input(z.object({
        id: z.string()
    }))
    .mutation(({ctx,input}) => {
        return prisma.workflow.delete({
            where:{
                id: input.id,
                userId: ctx.auth.user.id
            }
        })
    }),
    updateName: protectedProcedure
    .input(z.object({
        id: z.string(), 
        name: z.string().min(3).max(50)
    }))
    .mutation(({ctx,input}) => {
        return prisma.workflow.updateMany({
            where:{
                id: input.id,
                userId: ctx.auth.user.id
            },
            data:{
                name: input.name
            }
        })
    }
    ),
    all: protectedProcedure.query(({ctx}) => {
        return prisma.workflow.findMany({
            where:{
                userId: ctx.auth.user.id
            },
            orderBy:{
                updatedAt: 'desc'
            }
        })
    }
    ),
    getOne: protectedProcedure
    .input(z.object({
        id: z.string()  
    }))
    .query(({ctx,input}) => {
        return prisma.workflow.findFirst({
            where:{
                id: input.id,
                userId: ctx.auth.user.id
            }
        })
    })
    
});