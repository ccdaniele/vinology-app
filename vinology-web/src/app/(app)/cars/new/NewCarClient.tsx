'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

export default function NewCarClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryId = useMemo(() => Number(searchParams.get('queryId')), [searchParams])
  const [vin, setVin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!Number.isFinite(queryId) || queryId <= 0) {
      setError('Missing query. Create or open a query first.')
      return
    }
    const cleaned = vin.trim().toUpperCase()
    if (cleaned.length < 11) {
      setError('Enter a VIN (11–17 characters).')
      return
    }

    setLoading(true)
    setError('')
    try {
      const report = await api.lookupVin(cleaned)
      sessionStorage.setItem(
        'vinology_report',
        JSON.stringify({ queryId, ...report })
      )
      router.push('/report')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'VIN lookup failed')
      setLoading(false)
    }
  }

  return (
    <section className="rise" style={{ maxWidth: 560, display: 'grid', gap: '1rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Look up a VIN</h1>
      <p className="muted" style={{ margin: 0 }}>
        Decodes through free NHTSA vPIC data on the server, then loads recalls, complaint counts, and safety ratings when available.
      </p>
      <form onSubmit={onSubmit} className="panel" style={{ display: 'grid', gap: '1rem' }}>
        {error ? <p className="error">{error}</p> : null}
        <div className="field">
          <label htmlFor="vin">Vehicle identification number</label>
          <input
            id="vin"
            className="font-mono"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="JN8DR09Y82W703284"
            required
            disabled={loading}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Decoding with NHTSA…' : 'Decode VIN'}
        </button>
      </form>
    </section>
  )
}
