'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import type { User } from '@/lib/types'
import { AppShell } from '@/components/AppShell'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/login')
      return
    }

    api
      .currentUser()
      .then((u) => {
        setUser(u)
        setReady(true)
      })
      .catch(() => {
        router.replace('/login')
      })
  }, [router])

  if (!ready) {
    return (
      <div className="shell" style={{ paddingBlock: '4rem' }}>
        <p className="muted">Checking session…</p>
      </div>
    )
  }

  return <AppShell username={user?.username}>{children}</AppShell>
}
