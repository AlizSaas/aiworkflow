import { ExecutionsView } from '@/components/features/executions/components/list/executions'
import { requireAuth } from '@/lib/get-session'
import React from 'react'

export default async function Executions() {
  await requireAuth()
  return <ExecutionsView />
}
