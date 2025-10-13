import { prisma } from '@/lib/db'
import React from 'react'

export default async  function Home() {
  const test = await prisma.test.findMany({})
  return (
    <div>
      {JSON.stringify(test)}
    
      
    </div>
  )
}
