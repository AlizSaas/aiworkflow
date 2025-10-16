import { requireAuth } from '@/lib/get-session'
import React from 'react'

export default async function Executions() {
   await requireAuth()
  return (
    <div>Executions</div>
  )
}
