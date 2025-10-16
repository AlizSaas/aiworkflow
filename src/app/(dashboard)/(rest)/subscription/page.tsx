'use client'


import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'

import React from 'react'
import { toast } from 'sonner'

/**
 * Renders a centered "Test AI" button that triggers a TRPC test-ai mutation and shows toast notifications for success or error.
 *
 * When the button is clicked the component calls the mutation; on success it displays a success toast with `data.message`, and on error it displays an error toast with `error.message`.
 *
 * @returns The rendered React element.
 */
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