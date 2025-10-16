'use client'
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-clients";

export const useSubscription = () => {

    return useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const {data,error} = await authClient.customer.state()
          


            return data
            
        }

        
    })

} // useSubscription

export const useHasActiveSubscription = () => {
    const { data:customerState,isLoading,...rest} = useSubscription()

    const hasActiveSubscription = customerState?.activeSubscriptions && customerState?.activeSubscriptions.length > 0

    return {
        hasActiveSubscription,
        isLoading,
        subscription: customerState?.activeSubscriptions?.[0],
        ...rest
    }
} // useHasActiveSubscription