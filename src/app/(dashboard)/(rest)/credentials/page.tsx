import { CredentialsView } from '@/components/features/credentials/components/credentials'
import { requireAuth } from '@/lib/get-session'
import React from 'react'

export default async function Credentials() {
  await requireAuth()
  return <CredentialsView />
}
