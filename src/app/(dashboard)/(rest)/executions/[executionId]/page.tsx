import React from 'react'
interface ExecutionIdProps {
    params: Promise<{ executionId: string }>
}

export default async function ExecutionId({ params }: ExecutionIdProps) {
  const { executionId } = await params;

  return (
    <div>ExecutionId: {executionId}</div>
  )
}
