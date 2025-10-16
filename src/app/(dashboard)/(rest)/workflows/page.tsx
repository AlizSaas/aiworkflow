import { WorkFlowsContainer, WorkFlowsList } from '@/components/features/workflows/components/workflows'
import { prefetchWorkflows } from '@/components/features/workflows/server/prefetch'
import { requireAuth } from '@/lib/get-session'
import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import React, { Suspense } from 'react'
import type  { SearchParams } from 'nuqs'
import { WorkflowsParamsLoader } from '@/components/features/workflows/server/params-loader'

type Props = {
  searchParams:Promise<SearchParams>
}

export default async function Page({ searchParams }:Props) {
  await requireAuth()
  const params = await WorkflowsParamsLoader(searchParams)
  prefetchWorkflows(params)
  return (
    <WorkFlowsContainer>
       <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
            <WorkFlowsList />
        </Suspense>

        </ErrorBoundary>

       </HydrateClient>
    </WorkFlowsContainer>
  )
}
