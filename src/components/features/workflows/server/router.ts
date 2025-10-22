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

    update: protectedProcedure
    .input(z.object({
        id: z.string(), 
        nodes:z.array(z.object({
            id:z.string(),
            type:z.string().nullable().optional(),
            position:z.object({x:z.number(),y:z.number()}),
            data:z.record(z.string(),z.any()).optional()


        })),
        edges: z.array(z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),    
            targetHandle: z.string().nullish()
        }))


    }))
    .mutation( async ({ctx,input}) => {
        const { nodes, edges,id } = input

        const workflow = await prisma.workflow.findUniqueOrThrow({
            where:{
                id,
                userId: ctx.auth.user.id
            }
        })

        return await prisma.$transaction(async (tx) => {
            // Delete existing nodes and connections cascade deleted by foreign key
            await tx.node.deleteMany({
                where:{workflowId:id}
            }) // Delete existing nodes 
            // Create new nodes
            await tx.node.createMany({
                data: nodes.map((node) => ({
                    id: node.id,
                    type: node.type as NodeType,
                    position: node.position,
                    name: node.type  || 'UNKNOWN',
                    data: node.data || {},


                    workflowId: id
                }))
            })
            await tx.connection.createMany({
                data: edges.map((edge) => ({
                    fromNodeId: edge.source,
                    toNodeId: edge.target,
                    fromOutput: edge.sourceHandle || 'main',
                    toInput: edge.targetHandle || 'main',
                    workflowId: id
                }))

            })
            //
      await tx.workflow.update({
                where:{id},
                data:{
                    updatedAt: new Date()
                }


            })

                    return workflow



        })

        

    
        


    }
    ),







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
        // coerce undefined -> null for `type` to satisfy expected `string | null`
        const nodes = workFlow.nodes.map((node) => ({
            id: node.id,
            type: node.type ?? null,
            position: node.position as {x:number,y:number},
            data: (node.data as Record<string, unknown>) || {}
        }))

        // transform server connections to react-flow compatible edges
        // coerce undefined -> null for handles to satisfy `string | null`
        const edges = workFlow.connections.map((connection) => ({
            id: connection.id,
            source: connection.fromNodeId, // fromNodeId
            target: connection.toNodeId, // toNodeId
            sourceHandle: connection.fromOutput ?? null, // fromOutput
            targetHandle: connection.toInput ?? null // toInput
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