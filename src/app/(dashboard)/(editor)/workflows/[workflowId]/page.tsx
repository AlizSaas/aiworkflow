import { requireAuth } from '@/lib/get-session';

import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import React, { Suspense } from 'react'
import { prefetchWorkflow } from '@/components/features/workflows/server/prefetch';
import { EditorError,Editor,EditorLoading } from '@/components/features/editor/components/editor';
import {EditorHeader} from '@/components/features/editor/components/editor-header';
interface WorkflowIdProps {
    params: Promise<{ workflowId: string }>
}


/**
 * Render the workflow editor page for the given workflow ID.
 *
 * Ensures the user is authenticated and prefetches workflow data for client hydration,
 * then returns the hydrated React tree containing the editor header and editor.
 *
 * @param params - A promise that resolves to an object with the `workflowId` path parameter.
 * @returns The React element representing the workflow editor page.
 */
export default async function page({ params }: WorkflowIdProps) {
  await requireAuth()
  const { workflowId } = await params;

  prefetchWorkflow(workflowId)

  return (
    <div>
      <HydrateClient>
        <ErrorBoundary fallback={<EditorError />}>
          <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main className=''> 
          
              <Editor workflowId={workflowId} />

              </main>
            
         
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
      
    </div>
  )
}