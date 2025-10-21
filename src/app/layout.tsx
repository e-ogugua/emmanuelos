import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'EmmanuelOS v2.0 - SWART Dashboard',
  description: 'System-Wide Analytics, Reporting & Tracking dashboard for all personal and business apps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className}`}>
        {children}
      </body>
    </html>
  )
}
