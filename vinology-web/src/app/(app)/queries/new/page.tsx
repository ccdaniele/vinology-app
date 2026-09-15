'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function NewQueryPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const query = await api.createQuery(name.trim())
      router.push(`/cars/new?queryId=${query.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create query')
      setLoading(false)
    }
  }

  return (
    <section className="rise" style={{ maxWidth: 520, display: 'grid', gap: '1rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Name this query</h1>
      <p className="muted" style={{ margin: 0 }}>
        Something you’ll recognize later — seller, lot number, or client.
      </p>
      <form onSubmit={onSubmit} className="panel" style={{ display: 'grid', gap: '1rem' }}>
        {error ? <p className="error">{error}</p> : null}
        <div className="field">
          <label htmlFor="name">Query name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Continue to VIN lookup'}
        </button>
      </form>
    </section>
  )
}
