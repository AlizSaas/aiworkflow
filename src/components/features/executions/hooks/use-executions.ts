'use client';

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PAGINATION } from '@/config/constants';

export const useSuspenseExecutions = (params?: {
  page?: number;
  workflowId?: string;
}) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.executions.getMany.queryOptions({
      page: params?.page ?? PAGINATION.DEFAULT_PAGE,
      workflowId: params?.workflowId,
    })
  );
};

export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
