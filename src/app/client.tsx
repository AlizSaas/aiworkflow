'use client'
import { useTRPC } from '@/trpc/client'
import {  useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

   
export  function Client() {
    const trpc = useTRPC()
    const {data:test,} = useSuspenseQuery(trpc.getTest.queryOptions())
  return (
    <div className='flex flex-col'>
        {JSON.stringify(test)}
    </div>
  )
}
