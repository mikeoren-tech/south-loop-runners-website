import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"

import "./globals.css"

import { Inter, Geist_Mono, Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "South Loop Runners - Chicago Running Club",
  description:
    "Join Chicago's premier running community in the South Loop. All paces welcome for weekly runs, races, and social events.",
  generator: "v0.app",
  icons: {
    icon: "/slr-logo-transparent.png",
  },
  openGraph: {
    title: "South Loop Runners - Chicago Running Club",
    description:
      "Join Chicago's premier running community in the South Loop. All paces welcome for weekly runs, races, and social events.",
    images: [
      {
        url: "/slr-group-photo.jpeg",
        width: 1200,
        height: 630,
        alt: "South Loop Runners group photo with medals",
      },
    ],
    type: "website",
    siteName: "South Loop Runners",
  },
  twitter: {
    card: "summary_large_image",
    title: "South Loop Runners - Chicago Running Club",
    description:
      "Join Chicago's premier running community in the South Loop. All paces welcome for weekly runs, races, and social events.",
    images: ["/slr-group-photo.jpeg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-8VZ5WD7W0D" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8VZ5WD7W0D');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
