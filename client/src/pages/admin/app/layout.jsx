import React from "react"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Admin Dashboard - Feedback & Support",
  description: "Manage user feedback and support tickets",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}