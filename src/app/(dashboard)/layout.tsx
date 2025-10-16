import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import type React from "react"

/**
 * Layout component that wraps page content with the application sidebar and an inset container.
 *
 * @param children - Content to render inside the layout's inset area
 * @returns A React element that renders the sidebar and places `children` inside the inset container
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
