import React from 'react'
interface WorkflowIdProps {
    params: Promise<{ workflowId: string }>
}


export default async function page({ params }: WorkflowIdProps) {
  const { workflowId } = await params;

  return (
    <div>WorkflowId: {workflowId}</div>
  )
}
