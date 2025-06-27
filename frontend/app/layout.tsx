import type React from "react"
import type { Metadata } from "next"
import { M_PLUS_Rounded_1c } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: ["400", "700"], // Regular and Bold weights
  subsets: ["latin"],
  variable: "--font-rounded", // Define a CSS variable for the font
})

export const metadata: Metadata = {
  title: "PTA活動支援アプリ",
  description: "保護者のPTA活動参加を促進するアプリ",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${mPlusRounded1c.variable} font-rounded`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
