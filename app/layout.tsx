import type { Metadata } from 'next'
import { Cormorant_Garamond, Parisienne } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

const parisienne = Parisienne({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-parisienne',
})

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: 'An Evening by the Sea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${parisienne.variable}`}>
      <body>{children}</body>
    </html>
  )
}
