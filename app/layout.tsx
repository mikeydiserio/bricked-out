import type React from "react"
import type { Metadata } from "next"
import { geistSans } from "./fonts"
import "./globals.css"

import { Open_Sans as V0_Font_Open_Sans, Roboto as V0_Font_Roboto, Raleway as V0_Font_Raleway } from 'next/font/google'

// Initialize fonts
const _openSans = V0_Font_Open_Sans({ subsets: ['latin'], weight: ["300","400","500","600","700","800"], variable: '--v0-font-open-sans' })
const _roboto = V0_Font_Roboto({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"], variable: '--v0-font-roboto' })
const _raleway = V0_Font_Raleway({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"], variable: '--v0-font-raleway' })
const _v0_fontVariables = `${_openSans.variable} ${_roboto.variable} ${_raleway.variable}`

export const metadata: Metadata = {
  title: "V0 Blocks",
  description: "A 3D block building application",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} overflow-hidden`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${geistSans.className} antialiased overflow-hidden ${_v0_fontVariables}`}>{children}</body>
    </html>
  )
}
