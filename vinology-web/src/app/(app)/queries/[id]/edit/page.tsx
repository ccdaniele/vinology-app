'use client'

import { FormEvent, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function EditQueryPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const id = Number(params.id)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.updateQuery(id, name.trim())
      router.push('/queries')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename query')
      setLoading(false)
    }
  }

  return (
    <section className="rise" style={{ maxWidth: 520, display: 'grid', gap: '1rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Rename query</h1>
      <form onSubmit={onSubmit} className="panel" style={{ display: 'grid', gap: '1rem' }}>
        {error ? <p className="error">{error}</p> : null}
        <div className="field">
          <label htmlFor="name">New name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <button className="btn" type="submit" disabled={loading || !Number.isFinite(id)}>
          {loading ? 'Saving…' : 'Save name'}
        </button>
      </form>
    </section>
  )
}
