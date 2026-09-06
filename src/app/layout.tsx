import type { Metadata } from "next";
import "./globals.css";
import {  TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/features/theme/theme-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Provider } from 'jotai'

export const metadata: Metadata = {
  title: "FlowRiz",
  description: "Visual workflow automation builder powered by Next.js, Prisma, tRPC, and Inngest.",
};

/**
 * Root layout component that injects global fonts, theme and app providers around page content.
 *
 * @param children - The page or application content to render inside the theme and TRPC providers.
 * @returns The top-level HTML and body structure containing ThemeProvider, TRPCReactProvider, and the Toaster.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider enableSystem defaultTheme="system" attribute={'class'}disableTransitionOnChange 
        > 
        <TRPCReactProvider>
          <NuqsAdapter> 
            <Provider> 
        
          {children}
          </Provider>
          </NuqsAdapter>
          <Toaster position="top-center" richColors closeButton />
        </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}