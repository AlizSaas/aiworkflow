import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

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

interface EntitySearchProps {
    value: string
    onChange?:(value:string) => void
    placeholder?: string
}

export const EntitySearch = ({
    value,
    onChange,
    placeholder
}: EntitySearchProps) => {

    return (
        <div className="relative ml-auto">
            <SearchIcon className="size-3 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} />

        </div>
    )
}

interface EntityPaginationProps {
    page:number,
    totalPages:number,
    onPageChange:(page:number) => void
    disabled?:boolean
} 
export const EntityPagination = ({page,totalPages,onPageChange,disabled}:EntityPaginationProps) => {

    return (
        <div className="flex justify-between items-center gap-x-4 w-full">
           <div className="flex-1 text-sm text-muted-foreground">
            <span className="font-medium">
                Page {page} of {totalPages || 1}
            </span>

           </div>

           <div className="flex items-center justify-end space-x-2 py-4">
            <Button
            variant="outline"
            size="sm"   

            disabled={disabled || page <= 1} // disable if on first page
            onClick={() => onPageChange(Math.max(1,page - 1))} // ensure page doesn't go below 1
            >
                Previous
            </Button>
            <Button
            variant="outline"
            size="sm"   
            disabled={disabled || page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))} // ensure page doesn't exceed totalPages
            >
                Next
            </Button>


           </div>
        </div>

    )
}