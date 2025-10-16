import { WorkFlowsContainer, WorkFlowsList } from '@/components/features/workflows/components/workflows'
import { prefetchWorkflows } from '@/components/features/workflows/server/prefetch'
import { requireAuth } from '@/lib/get-session'
import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import React, { Suspense } from 'react'


export default async function Page() {
  await requireAuth()
 prefetchWorkflows()
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
