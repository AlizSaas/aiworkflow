import { requireAuth } from '@/lib/get-session'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import React from 'react'

interface CredentialsIdProps {
  params: Promise<{ credentialId: string }>
}

export default async function CredentialsId({ params }: CredentialsIdProps) {
  const { credentialId } = await params
  const session = await requireAuth()

  const credential = await prisma.credential.findUnique({
    where: { id: credentialId, userId: session.user.id },
    select: { id: true, name: true, type: true, createdAt: true, updatedAt: true },
  })

  if (!credential) notFound()

  return (
    <div className="p-4 md:px-10 md:py-6">
      <div className="mx-auto max-w-screen-xl flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h1 className="text-2xl font-bold">{credential.name}</h1>
          <Badge variant="secondary">{credential.type}</Badge>
        </div>
        <Card className="max-w-md shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDistanceToNow(credential.createdAt, { addSuffix: true })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated</span>
              <span>{formatDistanceToNow(credential.updatedAt, { addSuffix: true })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Value</span>
              <span className="font-mono">••••••••</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
