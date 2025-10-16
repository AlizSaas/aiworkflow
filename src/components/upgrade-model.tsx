import React from 'react'
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogOverlay,AlertDialogPortal,AlertDialogTitle,AlertDialogTrigger} from '@/components/ui/alert-dialog'
import {authClient} from '@/lib/auth-clients'
interface UpgradeModelProps {
open: boolean,
onOpenChange: (open: boolean) => void,
}
export default function UpgradeModel({ open, onOpenChange }: UpgradeModelProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
                Upgrade to the Pro plan to unlock this feature and more!
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
            onClick={() => {
                authClient.checkout({slug: 'pro'})
            }}
            >
                Upgrade

            </AlertDialogAction>


        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
