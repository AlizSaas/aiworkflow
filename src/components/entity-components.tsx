import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

 type EntityHeaderProps  = {
    title:string,
    description?:string
    newButtonLabel:string
    disabled?:boolean
    isCreating?:boolean
} & (
    |{ onNew: () => void; newButtonHref?:never } | { newButtonHref: string; onNew?:never } | { newButtonHref?:never; onNew?:never }
); // onNew is required if newButtonHref is not provided

export const EntityHeader = ({title, description, newButtonLabel, disabled, isCreating,newButtonHref,onNew}:EntityHeaderProps) =>{
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col">
                <h1 className="md:text-2xl  text-lg font-bold">{title}</h1>
            </div>
            {
                description && <p className="text-sm text-muted-foreground">{description}</p>
            }
            {
                onNew && !newButtonHref &&
 (
    <Button 
    size={'sm'}
    disabled={disabled || isCreating} onClick={onNew}>
        <PlusIcon className="size-4" />
        {newButtonLabel }
    </Button>
 )            }
 {
                newButtonHref && !onNew &&
 (
    <Button 
    size={'sm'}

    
    asChild
    >
        <Link href={newButtonHref} prefetch> 
        <PlusIcon className="size-4" />
        {newButtonLabel }
        </Link>
      
    </Button>
 )            
 }

        </div>
    )

}
type EntityContainerProps = {
    header?:React.ReactNode,
    search?:React.ReactNode,
    pagination?:React.ReactNode,
    children:React.ReactNode
}

export const EntityContainer = ({header,search,pagination,children}:EntityContainerProps) => {

    return (
        <div className="p-4 md:px-10 md:py-6 h-full ">
            <div className="mx-auto max-w-screen-xl  flex flex-col gap-y-8 h-full">
                {header}
       
            <div className="flex flex-col gap-y-4 h-full">
                {search}
                {children}
                {pagination}

            </div>
                 </div>
        </div>
    )
}