'use client'
import {CreditCardIcon,FolderOpenIcon,HistoryIcon,KeyIcon,LogOutIcon,StarIcon} from  'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname,useRouter } from 'next/navigation'
import {Sidebar,SidebarContent,SidebarFooter,SidebarGroup,  SidebarGroupContent,SidebarHeader,SidebarMenu,SidebarMenuButton,SidebarMenuItem} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { NavUser } from './nav-user'


const menuItems = [
   {
     title: 'Workflows',
    items:[
        {
        title: 'Workflows',
        icon: FolderOpenIcon,
        href: '/workflows'
    },
    {
        title:'Credentials',
        icon: KeyIcon,
        href: '/credentials'
    },
    {
        title:'Executions',
        icon: HistoryIcon,
        href: '/executions'
    }
    ]
   }
]

export const AppSidebar = () => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className='h-10 gap-x-4 px-4'>
                        <Link href='/' prefetch>
                            <Image 
                            src='/flow.png'
                            alt='Logo'
                            width={30}
                            height={30}
                         
                            className='rounded'
                            />
                            <span className=' text-sm'>
                                Flowriz
                            </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarHeader>
            <SidebarContent>
                {
                    menuItems.map((group) => (
                      <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            {
                            group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={
                                        item.href === '/' ? 
                                        pathname === '/' : pathname.startsWith(item.href)




                                     }
                                    asChild
                                    className='gap-x-4 h-10 px-4'
                                        >
                                            <Link
                                            
                                            className={cn(pathname === item.href ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground',)}
                                            href={item.href} prefetch>
                                                <item.icon className='size-4' />
                                                <span className='capitalize'>{item.title}</span>

                                            
                                            </Link>


                                    </SidebarMenuButton>


                                </SidebarMenuItem>
                            ))
                            }
                        </SidebarGroupContent>

                      </SidebarGroup>
                    ))}
                
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                        className='gap-x-4 h-10 px-4'
                        tooltip={'Upgrade to Pro'}
                        onClick={() => {}}
                        
                        >
                            <StarIcon className='size-4' />
                            <span>
                                Upgrade to Pro
                            </span>


                        </SidebarMenuButton>
                        <SidebarMenuButton 
                        className='gap-x-4 h-10 px-4'
                        tooltip={'Billing'}
                        onClick={() => {}}
                        
                        >
                            <CreditCardIcon className='size-4' />
                            <span>
                                Billing 
                            </span>


                        </SidebarMenuButton>
                        <NavUser />
                        </SidebarMenuItem>

                </SidebarMenu>

            </SidebarFooter>


        </Sidebar>
    )
}