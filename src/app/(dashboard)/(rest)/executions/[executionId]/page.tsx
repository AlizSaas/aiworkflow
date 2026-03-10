import { requireAuth } from '@/lib/get-session'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow, format } from 'date-fns'
import { ExecutionStatus } from '@/generated/prisma'
import React from 'react'

interface ExecutionIdProps {
  params: Promise<{ executionId: string }>
}

const statusVariantMap: Record<ExecutionStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [ExecutionStatus.PENDING]: 'secondary',
  [ExecutionStatus.RUNNING]: 'outline',
  [ExecutionStatus.COMPLETED]: 'default',
  [ExecutionStatus.FAILED]: 'destructive',
}

export default async function ExecutionId({ params }: ExecutionIdProps) {
  const { executionId } = await params
  const session = await requireAuth()

  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId, userId: session.user.id },
    include: {
      workflow: { select: { name: true } },
      logs: { orderBy: { startedAt: 'asc' } },
    },
  })

  if (!execution) notFound()

  return (
    <div className="p-4 md:px-10 md:py-6">
      <div className="mx-auto max-w-screen-xl flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h1 className="text-2xl font-bold">{execution.workflow.name}</h1>
          <Badge variant={statusVariantMap[execution.status]}>{execution.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Started {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
          {execution.completedAt &&
            ` · Completed ${formatDistanceToNow(execution.completedAt, { addSuffix: true })}`}
        </p>
        <h2 className="text-lg font-semibold">Execution Logs</h2>
        {execution.logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No logs yet.</p>
        ) : (
          <div className="flex flex-col gap-y-3">
            {execution.logs.map((log) => (
              <Card key={log.id} className="shadow-none">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{log.nodeName}</CardTitle>
                    <Badge variant={statusVariantMap[log.status]}>{log.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(log.startedAt, 'HH:mm:ss.SSS')}
                    {log.completedAt && ` → ${format(log.completedAt, 'HH:mm:ss.SSS')}`}
                  </p>
                </CardHeader>
                {log.output && (
                  <CardContent>
                    <pre className="text-xs bg-muted rounded p-2 overflow-auto max-h-48">
                      {JSON.stringify(log.output, null, 2)}
                    </pre>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
