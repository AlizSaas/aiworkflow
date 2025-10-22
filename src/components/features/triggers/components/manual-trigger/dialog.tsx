'use client'
import {Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogOverlay,DialogPortal,DialogTitle,DialogTrigger} from '@/components/ui/dialog'

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  
}

export const ManualTriggerDialog = ({open,onOpenChange}:Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent>
        <DialogHeader>
        <DialogTitle>
            Manual Trigger
        </DialogTitle>
        <DialogDescription>
       Configure settings for a manual trigger node
        </DialogDescription>
         </DialogHeader>
         <div className='py-4'>
            <p className='text-sm text-muted-foreground'>
            This node allows you to manually trigger the workflow by clicking the &apos;Execute Workflow&apos; button in the workflow editor.
            </p>
         </div>
       </DialogContent>
    </Dialog>
    )
}