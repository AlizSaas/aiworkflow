'use server'
import {  } from '@/inngest/channels/http-request'
import { manualTriggerChannel } from '@/inngest/channels/manual-trigger'
import { inngest } from '@/inngest/client'
import {getSubscriptionToken,type Realtime} from  '@inngest/realtime'
export type  ManuaLTriggerToken = Realtime.Token<typeof manualTriggerChannel,['status']>


export async function fetchManualTriggerRealtimeToken():Promise<ManuaLTriggerToken> {
    const token  = await getSubscriptionToken(inngest, {
        channel: manualTriggerChannel(),
        topics: ['status'],
    })
    return token;
} // this is a function to fetch the realtime token for manual trigger channel