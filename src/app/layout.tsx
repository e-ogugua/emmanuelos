import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'EmmanuelOS v3.0 - SWART Dashboard',
  description: 'System-Wide Analytics, Reporting & Tracking dashboard for all personal and business apps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          defer
          data-website-id="cf2ec833-0daa-4a57-b4ec-787a7b8ec605"
          src="https://cloud.umami.is/script.js"
        />
      </head>
      <body className={`${inter.className} ${poppins.className}`}>
        {children}
      </body>
    </html>
  )
}
