import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vinology',
  description: 'Research a vehicle from its VIN — specs, saved queries, and PDF reports.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
