import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { AnalyticsProvider } from '../contexts/AnalyticsContext'
import { AdminProvider } from '../contexts/AdminContext'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'EmmanuelOS - SWART Dashboard',
  description: 'System-Wide Analytics, Reporting & Tracking dashboard for all personal and business apps',
  icons: {
    icon: '/emmanuelos/emmanuelos-logo.png',
    shortcut: '/emmanuelos/emmanuelos-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script
          async
          defer
          data-website-id="cf2ec833-0daa-4a57-b4ec-787a7b8ec605"
          src="https://cloud.umami.is/script.js"
        />
      </head>
      <body className={`${inter.className} ${poppins.className}`}>
        <AdminProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
