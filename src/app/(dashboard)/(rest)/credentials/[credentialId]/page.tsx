import React from 'react'
interface CredentialsIdProps {
    params: Promise<{ credentialId: string }>
}

export default async function CredentialsId({ params }: CredentialsIdProps) {
  const { credentialId } = await params;

  return (
    <div>CredentialsId: {credentialId}</div>
  )
}
