'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clearToken } from '@/lib/auth'

const links = [
  { href: '/home', label: 'Home' },
  { href: '/queries', label: 'Queries' },
  { href: '/queries/new', label: 'New query' },
]

export function AppShell({
  children,
  username,
}: {
  children: React.ReactNode
  username?: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  function logout() {
    clearToken()
    router.replace('/login')
  }

  return (
    <div className="shell" style={{ paddingBlock: '1.5rem 3rem' }}>
      <header
        className="rise"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <Link href="/home" className="font-display" style={{ fontSize: '1.6rem' }}>
          Vinology
        </Link>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.92rem',
                  borderBottom: active ? '2px solid var(--wine)' : '2px solid transparent',
                  paddingBottom: '0.15rem',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          {username ? (
            <span className="muted" style={{ fontSize: '0.85rem' }}>
              {username}
            </span>
          ) : null}
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Log out
          </button>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
