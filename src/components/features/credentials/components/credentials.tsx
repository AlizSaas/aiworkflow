'use client';
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from '@/components/entity-components';
import { Badge } from '@/components/ui/badge';
import { PAGINATION } from '@/config/constants';
import { KeyRoundIcon } from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useCreateCredential, useRemoveCredential, useSuspenseCredentials } from '../hooks/use-credentials';
import { CreateCredentialDialog } from './create-credential-dialog';
import type { CredentialFormValues } from './create-credential-dialog';

export const CredentialsHeader = ({ onNew, isCreating }: { onNew: () => void; isCreating?: boolean }) => (
  <EntityHeader
    title="Credentials"
    newButtonLabel="New Credential"
    onNew={onNew}
    isCreating={isCreating}
  />
);

interface CredentialsListProps {
  page: number;
  search: string;
  onPageChange: (page: number) => void;
}

const CredentialsListInner = ({ page, search, onPageChange }: CredentialsListProps) => {
  const credentials = useSuspenseCredentials({ page, search });

  return (
    <>
      <EntityList
        items={credentials.data.items}
        getKey={(c) => c.id}
        renderItem={(c) => <CredentialItem key={c.id} data={c} />}
        emptyView={<CredentialsEmpty />}
      />
      <EntityPagination
        disabled={credentials.isRefetching}
        totalPages={credentials.data.totalPages}
        page={credentials.data.page}
        onPageChange={onPageChange}
      />
    </>
  );
};

export const CredentialsLoading = () => (
  <LoadingView message="Loading credentials..." />
);

export const CredentialsError = () => (
  <ErrorView message="Could not load credentials" />
);

export const CredentialsEmpty = () => {
  const [open, setOpen] = useState(false);
  const createCredential = useCreateCredential();

  return (
    <>
      <CreateCredentialDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(values) => createCredential.mutate(values)}
        isSubmitting={createCredential.isPending}
      />
      <EmptyView message="No credentials found" onNew={() => setOpen(true)} />
    </>
  );
};

interface CredentialData {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CredentialItem = ({ data }: { data: CredentialData }) => {
  const removeCredential = useRemoveCredential();

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      substitle={<Badge variant="secondary">{data.type}</Badge>}
      image={
        <div className="size-8 flex items-center justify-center">
          <KeyRoundIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={() => removeCredential.mutate({ id: data.id })}
      isRemoving={removeCredential.isPending}
    />
  );
};

export const CredentialsView = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [search, setSearch] = useState('');
  const createCredential = useCreateCredential();

  const handleSubmit = (values: CredentialFormValues) => {
    createCredential.mutate(values);
  };

  return (
    <EntityContainer
      header={
        <>
          <CreateCredentialDialog
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
            isSubmitting={createCredential.isPending}
          />
          <CredentialsHeader onNew={() => setOpen(true)} isCreating={createCredential.isPending} />
        </>
      }
      search={
        <EntitySearch
          value={search}
          onChange={setSearch}
          placeholder="Search credentials"
        />
      }
    >
      <ErrorBoundary fallback={<CredentialsError />}>
        <Suspense fallback={<CredentialsLoading />}>
          <CredentialsListInner page={page} search={search} onPageChange={setPage} />
        </Suspense>
      </ErrorBoundary>
    </EntityContainer>
  );
};
