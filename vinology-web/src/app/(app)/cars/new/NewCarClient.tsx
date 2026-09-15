'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { decodeVinMock } from '@/lib/mockVin'

export default function NewCarClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryId = useMemo(() => Number(searchParams.get('queryId')), [searchParams])
  const [vin, setVin] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!Number.isFinite(queryId) || queryId <= 0) {
      setError('Missing query. Create or open a query first.')
      return
    }
    const cleaned = vin.trim().toUpperCase()
    if (cleaned.length < 11) {
      setError('Enter a VIN (at least 11 characters for a partial decode demo).')
      return
    }

    const spec = decodeVinMock(cleaned)
    sessionStorage.setItem(
      'vinology_report',
      JSON.stringify({ queryId, specification: spec })
    )
    router.push('/report')
  }

  return (
    <section className="rise" style={{ maxWidth: 560, display: 'grid', gap: '1rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Look up a VIN</h1>
      <p className="muted" style={{ margin: 0 }}>
        Specs are sample data for now. Phase 3 will decode through free NHTSA APIs on the server.
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
          />
        </div>
        <button className="btn" type="submit">
          Decode VIN
        </button>
      </form>
    </section>
  )
}
