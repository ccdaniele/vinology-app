'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.register({ username, email, password })
      router.replace('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell" style={{ maxWidth: 460, paddingBlock: '4rem' }}>
      <Link href="/" className="font-display" style={{ fontSize: '1.5rem' }}>
        Vinology
      </Link>
      <h1 style={{ marginTop: '1.5rem', fontSize: '1.75rem' }}>Create account</h1>
      <form onSubmit={onSubmit} className="panel rise" style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        {error ? <p className="error">{error}</p> : null}
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Sign up'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: '1rem' }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </div>
  )
}
