import { requireAuth } from '@/lib/get-session'
import React from 'react'

export default async function Credentials() {
   await requireAuth()
  return (
    <div>Credentials</div>
  )
}
