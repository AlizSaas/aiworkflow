'use client'
import { Button } from '@/components/ui/button'
import {Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogOverlay,DialogPortal,DialogTitle,DialogTrigger} from '@/components/ui/dialog'
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod';
const formSchema = z.object({
    endPoint: z.url({message: "Invalid URL format"}),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    body: z.string().optional(),
});
export type FormType = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values:z.infer<typeof formSchema>)=>void;
    defaultEndpoint?:string;
    defaultMethod?:'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    defaultBody?:string;
  
}


export const HttpRequestDialog = ({open,onOpenChange,onSubmit,defaultEndpoint,defaultMethod='GET',defaultBody}:Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endPoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody
        }
    });
    useEffect(() => {
    if(open) {
        form.reset({
            endPoint: defaultEndpoint,
            method: defaultMethod,  
            body: defaultBody
        });
        
    }
},[open,defaultEndpoint,defaultMethod,defaultBody,form]);
const watchMethod = form.watch('method');
const showBodyField = watchMethod === 'POST' || watchMethod === 'PUT' || watchMethod === 'PATCH';
const handleFormSubmit = (values:z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
}


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent>
        <DialogHeader>
        <DialogTitle>
            Http Request
            </DialogTitle>
        <DialogDescription>
       Configure settings for a HTTP request node
        </DialogDescription>
         </DialogHeader>
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 mt-4" > 
            <FormField 
            control={form.control}
             name="method"
             render={({field}) => (
                <FormItem>
                    <FormLabel>HTTP Method</FormLabel>
                    <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a  method" />
                            </SelectTrigger>
                           
                        </FormControl>
                         <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                                <SelectItem value="PATCH">PATCH</SelectItem>
                            </SelectContent>

                    </Select>
                    <FormDescription>
                        The HTTP method to use for the request.

                    </FormDescription>
                    <FormMessage />


                </FormItem>
             )}/>
            <FormField 
            control={form.control}
             name="endPoint"
             render={({field}) => (
                        <FormItem>
                            <FormLabel>HTTP Endpoint</FormLabel>
                            <FormControl>
                                <Input placeholder="http://example.com/api" {...field} />
                            </FormControl>
                            <FormDescription>
                       Static URL or use {"{{variable_name}}"} for simple values or {"{{json variable}}" } to stringify Object
                            </FormDescription>
                    <FormMessage />


                </FormItem>
             )}/>
                {showBodyField && (
                    <FormField 
                    control={form.control}
                     name="body"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Request Body</FormLabel>
                                <FormControl>
                                    <Textarea 
                                    className='min-h-[120px] font-mono text-sm'

                                    placeholder={`{\n "userId": "{{httpResponse.data.id}}"}, \n "name": "{{httpResponse.data.name}}"\n}, "items": [\n {\n "id": "{{item.id}}",\n "name": "{{item.name}}"\n }\n ]}`} {...field} />
                                </FormControl>
                                <FormDescription>
                        JSON with template variables Use {"{{variable_name}}"} for simple values or {"{{json variable}}" } to stringify Object
                            

                                </FormDescription>
                    <FormMessage />
                            </FormItem>
                        )}/>
                )}
                <DialogFooter className='mt-4'> 
                    <Button type='submit'>
                        Save

                    </Button>
                </DialogFooter>


            </form>
            
             </Form>
       </DialogContent>
    </Dialog>
    )
}