'use client'


import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'

import React from 'react'
import { toast } from 'sonner'

export default function TestSubs() {
    const trpc = useTRPC()

    const generateAI = useMutation(trpc.testAi.mutationOptions({
        onSuccess: (data) => {
            toast.success(data.message)

        },
        onError: (error) => {
            toast.error(error.message)
        }
        
    }))
    




  return (
    <div className='min-h-screen  flex items-center justify-center mx-auto'>
        <Button onClick={
            () => {
                generateAI.mutate()
            }

           
            
        }>Test AI</Button>
    </div>
  )
}
