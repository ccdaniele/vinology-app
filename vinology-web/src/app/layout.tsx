import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Vinology',
    template: '%s · Vinology',
  },
  description:
    'Research a vehicle from its VIN using free NHTSA data — specs, recalls, saved queries, and PDF reports.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
