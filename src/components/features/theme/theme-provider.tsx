"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Wraps `NextThemesProvider`, forwarding all received props and rendering the provided children inside it.
 *
 * @param props - Props passed through to `NextThemesProvider`.
 * @param children - Elements rendered as children of the provider.
 * @returns A `NextThemesProvider` element configured with the provided props and children.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}