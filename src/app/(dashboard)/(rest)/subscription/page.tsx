'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useHasActiveSubscription } from '@/components/features/subscriptions/hooks/use-subscription'
import { authClient } from '@/lib/auth-clients'
import React from 'react'

export default function Subscription() {
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription()

  const handleCheckout = () => {
    authClient.checkout({ slug: 'pro' })
  }

  const handleManage = () => {
    authClient.customer.portal()
  }

  return (
    <div className="p-4 md:px-10 md:py-6">
      <div className="mx-auto max-w-screen-xl flex flex-col gap-y-8">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{hasActiveSubscription ? 'Pro Plan' : 'Free Plan'}</CardTitle>
            <CardDescription>
              {hasActiveSubscription
                ? 'Your subscription is active.'
                : 'Upgrade to Pro to create unlimited workflows.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? null : hasActiveSubscription ? (
              <Button onClick={handleManage} variant="outline">
                Manage Subscription
              </Button>
            ) : (
              <Button onClick={handleCheckout}>Upgrade to Pro</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
