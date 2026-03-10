'use client';
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from '@/components/entity-components';
import { Badge } from '@/components/ui/badge';
import { PAGINATION } from '@/config/constants';
import { ExecutionStatus } from '@/generated/prisma';
import { formatDistanceToNow } from 'date-fns';
import { ActivityIcon } from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseExecutions } from '../../hooks/use-executions';

const statusVariantMap: Record<
  ExecutionStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [ExecutionStatus.PENDING]: 'secondary',
  [ExecutionStatus.RUNNING]: 'outline',
  [ExecutionStatus.COMPLETED]: 'default',
  [ExecutionStatus.FAILED]: 'destructive',
};

interface ExecutionData {
  id: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt: Date | null;
  workflowId: string;
  workflow: { name: string };
}

export const ExecutionItem = ({ data }: { data: ExecutionData }) => {
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.workflow.name}
      substitle={
        <>
          Started {formatDistanceToNow(new Date(data.startedAt), { addSuffix: true })}{' '}
          &bull;{' '}
          {data.completedAt
            ? `Completed ${formatDistanceToNow(new Date(data.completedAt), { addSuffix: true })}`
            : 'In progress'}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <ActivityIcon className="size-5 text-muted-foreground" />
        </div>
      }
      actions={
        <Badge variant={statusVariantMap[data.status]}>{data.status}</Badge>
      }
    />
  );
};

interface ExecutionsListInnerProps {
  page: number;
  onPageChange: (page: number) => void;
}

const ExecutionsListInner = ({ page, onPageChange }: ExecutionsListInnerProps) => {
  const executions = useSuspenseExecutions({ page });

  return (
    <>
      <EntityList
        items={executions.data.items as ExecutionData[]}
        getKey={(e) => e.id}
        renderItem={(e) => <ExecutionItem key={e.id} data={e} />}
        emptyView={<ExecutionsEmpty />}
      />
      <EntityPagination
        disabled={executions.isRefetching}
        totalPages={executions.data.totalPages}
        page={executions.data.page}
        onPageChange={onPageChange}
      />
    </>
  );
};

export const ExecutionsLoading = () => (
  <LoadingView message="Loading executions..." />
);

export const ExecutionsError = () => (
  <ErrorView message="Could not load executions" />
);

export const ExecutionsEmpty = () => (
  <EmptyView message="No executions found. Run a workflow to see results here." />
);

export const ExecutionsView = () => {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);

  return (
    <EntityContainer
      header={<EntityHeader title="Executions" newButtonLabel="" />}
    >
      <ErrorBoundary fallback={<ExecutionsError />}>
        <Suspense fallback={<ExecutionsLoading />}>
          <ExecutionsListInner page={page} onPageChange={setPage} />
        </Suspense>
      </ErrorBoundary>
    </EntityContainer>
  );
};
