
import { AlertTriangleIcon, Loader2Icon, MoreVertical, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {Empty,EmptyContent,EmptyDescription,EmptyHeader,EmptyMedia,EmptyTitle} from './ui/empty'
import { Card,CardAction,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from './ui/card'
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from './ui/dropdown-menu'
import { cn } from "@/lib/utils";

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

interface StateViewProps {
    message?:string

}

interface LoadingViewProps extends StateViewProps {
    entity?: string
}

export const LoadingView = ({ message }: LoadingViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <Loader2Icon className="size-6 animate-spin" />
            {
                !!message && (
                    <p className="text-sm text-muted-foreground">
                        {message}
                    </p>
                )
            }
        </div>
    )
}

interface ErrorViewProps extends StateViewProps {
    entity?: string
}

export const ErrorView = ({ message }: ErrorViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
           <AlertTriangleIcon className="size-6 text-destructive" />
            {
                !!message && (
                    <p className="text-sm text-muted-foreground">
                        {message}
                    </p>
                )
            }
        </div>
    )
}
interface EmptyViewProps extends StateViewProps {
    onNew?: () => void
}
export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
    return (
        <Empty className="border border-dashed ">
            <EmptyHeader>
                <EmptyMedia variant={'icon' } >

                    <PackageOpenIcon className="size-6 text-muted-foreground" />
                </EmptyMedia>

            </EmptyHeader>
            <EmptyTitle>
                {'No items found'}
            </EmptyTitle>
          
       {
        !!message && (
                 <EmptyDescription>
                {message}
            </EmptyDescription>
        )
       }
       {
        !!onNew && (
            <EmptyContent>
                <Button onClick={onNew} size="sm">
                    <PlusIcon className="size-4" />
                    Add item
                </Button>
            </EmptyContent>
        )

       }

        </Empty>
    )
}
interface EntityListProps<T> {
    items: T[]
    renderItem: (item: T, index: number) => React.ReactNode
    getKey?: (item: T, index: number) => string | number
    emptyView?: React.ReactNode
    className?: string
}

export const EntityList = <T,>({ items, renderItem, getKey, emptyView, className }: EntityListProps<T>) => {
    if(items.length === 0 && emptyView) {
        return (
            <div className="flex-1 flex justify-between items-center">
                <div className="max-w-sm mx-auto">
                    {emptyView}
                </div>

            </div>

        )
    }
    return (
        <div className={cn("flex flex-col gap-y-4", className)}>
            {
                items.map((item, index) => (
                    <div key={getKey ? getKey(item, index) : index}>
                        {renderItem(item, index)}

                    </div>
                ))
            }
            
        </div>
    )
}

interface  EntityItemProps {
    href:string,
    title:string,
    substitle?:React.ReactNode,
    image?:React.ReactNode,
    actions?:React.ReactNode,
    onRemove?:() => void | Promise<void>
    isRemoving?:boolean
    className?:string
}

export const EntityItem = ({ href, title, substitle, image, actions, onRemove,className,isRemoving }: EntityItemProps) => {
    const handleRemove = async (e:React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if(isRemoving) return
        if(onRemove) {
            await onRemove()
        }
    }

    return (
        <Link href={href} prefetch>
            <Card className={cn("hover:shadow-md transition-shadow cursor-pointer shadow-none", 

                isRemoving && 'opacity-50 cursor-not-allowed',
                className
            )}>
                <CardContent className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                        {image}
                        <div>
                            <CardTitle className="text-base font-medium">
                                {title}
                            </CardTitle>
                            {
                                !!substitle && (
                                    <CardDescription className="text-sm">
                                        {substitle}
                                    </CardDescription>
                                )
                            }
                        </div>

                    </div>
                    {(actions || onRemove) && (
                        <div className="flex gap-x-4 items-center">
                            {actions}
                            {
                                onRemove && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" disabled={isRemoving}
                                            onClick={(e) => e.stopPropagation()} // prevent card click
                                            
                                            >
                                                <MoreVerticalIcon className="size-4" />

                                                </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end"
                                        onClick={(e) => e.stopPropagation()}
                                        
                                        >
                                           <DropdownMenuItem
                                           onClick={handleRemove}
                                           >
                                             <TrashIcon className="size-4 text-destructive " />
                                             Delete
                                           </DropdownMenuItem>



                                            </DropdownMenuContent>

                                    </DropdownMenu>
                                )
                            }

                        </div>
                    )}

                </CardContent>

            </Card>
        </Link>
    )
}