 'use client'
import { Button } from '@/components/ui/button'
 import { SidebarTrigger } from '@/components/ui/sidebar'
import { SaveIcon } from 'lucide-react'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Input} from '@/components/ui/input'
 import { useRef,useState,useEffect } from 'react'
 import Link from 'next/link'
import { useSuspenseWorkflow, useUpdateworkflowName } from '../../workflows/hooks/use-workflows'

export const EditorSaveButton = ({workflowId}:{workflowId:string}) => {
    return (
        <div className='ml-auto'>
           <Button
           disabled={false}
           
            onClick={() =>{}}>
                
            <SaveIcon className='size-4 mr-2' />
            Save
           </Button>
        </div>
    )
}

export const EditorNameInput = ({workflowId}:{workflowId:string}) => {
  const {data:workflow} =  useSuspenseWorkflow(workflowId)
  const updateWorkflow = useUpdateworkflowName()
  const [isEditing,setIsEditing] = useState(false)
  const [name,setName] = useState(workflow.name)

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(()=> {
    if(workflow.name) {
      setName(workflow.name)
    }
  },[workflow.name])

  useEffect(() => {
    if(isEditing && inputRef.current) {
      inputRef.current.focus() // focus the input when editing starts
      inputRef.current.select() // select the text for easy editing
    }

  },[isEditing])

  const handleSave = async () => {
    if(name === workflow.name) {
      setIsEditing(false)
      return
    }
setIsEditing(false)
    try {
      await updateWorkflow.mutateAsync({
        id: workflowId,
        name
      })
   
      
    } catch  {
      setName(workflow.name) // revert name on error
      
    }
    finally{
      setIsEditing(false)
    }



  } // handle save name change

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave()
    }
    if (e.key === "Escape") {
      setName(workflow.name)
      setIsEditing(false)
    }

  }
  if(isEditing) {
    return (
      <Input 
      disabled={updateWorkflow.isPending}
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className='h-7 w-auto min-[100px] px-2 outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent'
      />
    )
  }

  return (
    <BreadcrumbItem 
    onClick={() => {setIsEditing(true)}}
    className='cursor-pointer hover:text-foreground transition-colors'>
    {workflow.name}
    
    </BreadcrumbItem>
  )


}
export const EditorBreadcrumbs = ({workflowId}:{workflowId:string}) => {
    return (
       <Breadcrumb>
       <BreadcrumbList>
       <BreadcrumbItem>
       <BreadcrumbLink asChild>
       <Link prefetch href={`/workflows/`}>
       Workflow 
       </Link>
       </BreadcrumbLink>
       </BreadcrumbItem>
         <BreadcrumbSeparator></BreadcrumbSeparator>
          <EditorNameInput workflowId={workflowId} />
       </BreadcrumbList>
       </Breadcrumb>
    )
}


export  function EditorHeader({workflowId}:{workflowId:string}) {
    return (
 <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger />
          <div className='flex flex-row items-center justify-between w-full gap-x-4'>
            <EditorBreadcrumbs workflowId={workflowId} />
            <EditorSaveButton workflowId={workflowId} />

          </div>
        </header>
    )
    }
