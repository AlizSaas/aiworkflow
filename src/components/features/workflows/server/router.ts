import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { Node,Edge } from "@xyflow/react";
import {generateSlug} from 'random-word-slugs'
import z from "zod";


export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(({ctx}) => {
        return prisma.workflow.create({
            data:{
                name: generateSlug(5),
                userId: ctx.auth.user.id,
                nodes: {
                    create:{
                        type: NodeType.INITIAL,
                        position: {x:0,y:0}, // Example position
                        name: NodeType.INITIAL

                    }
                }
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
        return prisma.workflow.update({
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
    .query( async  ({ctx,input}) => {
const workFlow = await prisma.workflow.findUniqueOrThrow({
            where:{
                id: input.id,
                userId: ctx.auth.user.id
            },
            include:{
                nodes: true,
                connections: true
            }
        })
        // transform server nodes to react-flow compatible nodes

        const nodes:Node[] = workFlow.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position as {x:number,y:number},
            data: (node.data  as Record<string, unknown>) || {}

        }))

        // transform server connections to react-flow compatible edges
        const edges:Edge[] = workFlow.connections.map((connection) => ({
            id: connection.id,
            source:connection.fromNodeId, // fromNodeId
            target: connection.toNodeId, // toNodeId
            sourceHandle: connection.fromOutput, // fromOutput
            targetHandle: connection.toInput // toInput

        }))

        return {
            id: workFlow.id,
            name: workFlow.name,
            nodes,
            edges,
        }
    }),


    getMany: protectedProcedure
    .input(z.object({
        page:z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(''),
      
    }))
    .query( async ({ctx,input}) => {
        const { page, pageSize, search } = input

        const [items,totalCount] = await Promise.all([
            prisma.workflow.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,

                where:{userId: ctx.auth.user.id,
                    name:{
                        contains: search,
                        mode: 'insensitive'
                    }


                },
                orderBy:{
                    updatedAt: 'desc'
                }
            }),
            prisma.workflow.count({
                where:{userId: ctx.auth.user.id,
                    name:{
                        contains: search,
                        mode: 'insensitive'
                    } //
                }
            })
        ])

        const totalPages = Math.ceil(totalCount / pageSize) // Round up to the nearest whole number
        const hasNextPage = page < totalPages // Check if there are more pages available
        const hasPreviousPage = page > 1 // Check if there are previous pages available

        return {
            items,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage

        }
        
    }
    )

    
});