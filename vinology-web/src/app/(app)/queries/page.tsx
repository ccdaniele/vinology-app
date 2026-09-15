'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Query } from '@/lib/types'

export default function QueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      setQueries(await api.listQueries())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load queries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function onDelete(id: number) {
    try {
      await api.deleteQuery(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete query')
    }
  }

  return (
    <section className="rise" style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>My queries</h1>
          <p className="muted" style={{ margin: '0.35rem 0 0' }}>
            Each query is a folder for VIN lookups.
          </p>
        </div>
        <Link href="/queries/new" className="btn">
          New query
        </Link>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {loading ? <p className="muted">Loading…</p> : null}

      {!loading && queries.length === 0 ? (
        <div className="panel">
          <p style={{ margin: 0 }}>No queries yet.</p>
          <Link href="/queries/new" style={{ color: 'var(--wine)' }}>
            Create your first query
          </Link>
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {queries.map((query) => (
          <article key={query.id} className="panel" style={{ display: 'grid', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 className="font-display" style={{ margin: 0, fontSize: '1.4rem' }}>
                {query.name}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link className="btn btn-secondary" href={`/cars/new?queryId=${query.id}`}>
                  Add VIN
                </Link>
                <Link className="btn btn-secondary" href={`/queries/${query.id}/edit`}>
                  Rename
                </Link>
                <button type="button" className="btn btn-ghost" onClick={() => onDelete(query.id)}>
                  Delete
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(query.cars || []).length === 0 ? (
                <span className="muted">No vehicles saved yet.</span>
              ) : (
                query.cars.map((car) => (
                  <Link
                    key={car.id}
                    href={`/cars/${car.id}`}
                    className="font-mono"
                    style={{
                      border: '1px solid var(--line)',
                      padding: '0.45rem 0.7rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    {(car.year || '')} {(car.make || '')} {(car.model || car.vin_number)}
                  </Link>
                ))
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
