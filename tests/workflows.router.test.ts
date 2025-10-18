import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCallerFactory } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
import { NodeType } from '@/generated/prisma';

// Mocks
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user_1', email: 'u@test' } }),
    },
  },
}));

vi.mock('@/lib/polar', () => ({
  polarClient: {
    customers: {
      getStateExternal: vi.fn().mockResolvedValue({ activeSubscriptions: [{}] }),
    },
  },
}));

// Prisma mock
const prismaMock = {
  workflow: {
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    findUniqueOrThrow: vi.fn(),
  },
};

vi.mock('@/lib/db', () => ({
  prisma: prismaMock,
}));

const createCaller = createCallerFactory(appRouter);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('workflowsRouter', () => {
  it('create: seeds INITIAL node at (0,0)', async () => {
    prismaMock.workflow.create.mockResolvedValue({ id: 'w1' });

    const caller = createCaller({});
    await caller.workflows.create();

    expect(prismaMock.workflow.create).toHaveBeenCalledTimes(1);
    const arg = prismaMock.workflow.create.mock.calls[0][0];
    expect(arg.data.nodes.create.type).toBe(NodeType.INITIAL);
    expect(arg.data.nodes.create.position).toEqual({ x: 0, y: 0 });
  });

  it('getOne: transforms Node/Connection models into ReactFlow nodes/edges', async () => {
    prismaMock.workflow.findUniqueOrThrow.mockResolvedValue({
      id: 'w1',
      name: 'WF',
      nodes: [{ id: 'n1', type: 'INITIAL', position: { x: 1, y: 2 }, data: {} }],
      connections: [
        { id: 'c1', fromNodeId: 'n1', toNodeId: 'n2', fromOutput: 'main', toInput: 'main' },
      ],
    });

    const caller = createCaller({});
    const result = await caller.workflows.getOne({ id: 'w1' });

    expect(result).toEqual({
      id: 'w1',
      name: 'WF',
      nodes: [{ id: 'n1', type: 'INITIAL', position: { x: 1, y: 2 }, data: {} }],
      edges: [
        {
          id: 'c1',
          source: 'n1',
          target: 'n2',
          sourceHandle: 'main',
          targetHandle: 'main',
        },
      ],
    });
  });

  it('getMany: paginates and returns meta flags', async () => {
    prismaMock.workflow.findMany.mockResolvedValue([{ id: 'a' }]);
    prismaMock.workflow.count.mockResolvedValue(23);

    const caller = createCaller({});
    const res = await caller.workflows.getMany({ page: 2, pageSize: 10, search: '' });

    expect(res.items).toHaveLength(1);
    expect(res.totalCount).toBe(23);
    expect(res.totalPages).toBe(3);
    expect(res.hasNextPage).toBe(true);
    expect(res.hasPreviousPage).toBe(true);
  });

  it('updateName: rejects invalid name via zod', async () => {
    const caller = createCaller({});
    await expect(caller.workflows.updateName({ id: 'w', name: 'ab' })).rejects.toBeTruthy();
  });
});