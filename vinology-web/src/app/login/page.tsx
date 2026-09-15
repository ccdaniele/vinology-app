'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { setToken } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await api.login(username, password)
      setToken(data.jwt)
      router.replace('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main id="main" className="shell" style={{ maxWidth: 460, paddingBlock: '4rem' }}>
      <Link href="/" className="font-display" style={{ fontSize: '1.5rem' }}>
        Vinology
      </Link>
      <h1 style={{ marginTop: '1.5rem', fontSize: '1.75rem' }}>Sign in</h1>
      <p className="muted">Use your account or the demo seed user (<code>demo</code> / <code>password</code>).</p>
      <form
        onSubmit={onSubmit}
        className="panel rise"
        style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}
        aria-busy={loading}
      >
        {error ? <p className="error" role="alert">{error}</p> : null}
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: '1rem' }}>
        No account? <Link href="/register">Create one</Link>
      </p>
    </main>
  )
}
