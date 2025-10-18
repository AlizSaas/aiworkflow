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
