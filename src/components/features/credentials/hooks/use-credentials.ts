'use client';

import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PAGINATION } from '@/config/constants';

export const useSuspenseCredentials = (params?: { page?: number; search?: string }) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.credentials.getMany.queryOptions({
      page: params?.page ?? PAGINATION.DEFAULT_PAGE,
      search: params?.search ?? '',
    })
  );
};

export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created successfully`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Error creating credential: ${error.message}`);
      },
    })
  );
};

export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" deleted successfully`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Error deleting credential: ${error.message}`);
      },
    })
  );
};
