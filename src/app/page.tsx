import { getQueryClient, trpc } from '@/trpc/server'
import React, { Suspense } from 'react'
import { Client } from './client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async  function page() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.getTest.queryOptions())
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
        <Client /> 
        </Suspense>

      </HydrationBoundary>
      
    </div>
  )
}
