'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { downloadSpecPdf } from '@/lib/pdf'
import type { VehicleSpecification } from '@/lib/types'

type ReportPayload = {
  queryId: number
  specification: VehicleSpecification
}

export default function ReportPage() {
  const router = useRouter()
  const [payload, setPayload] = useState<ReportPayload | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('vinology_report')
    if (!raw) {
      setError('No report in progress. Look up a VIN from a query first.')
      return
    }
    try {
      setPayload(JSON.parse(raw) as ReportPayload)
    } catch {
      setError('Could not read report payload.')
    }
  }, [])

  async function saveCar() {
    if (!payload) return
    setSaving(true)
    setError('')
    try {
      const s = payload.specification
      await api.createCar({
        query_id: payload.queryId,
        vin_number: s.vin,
        make: s.make,
        model: s.model,
        year: s.year,
        trim_level: s.trim_level,
        standard_seating: s.standard_seating,
        highway_mileage: s.highway_mileage,
        city_mileage: s.city_mileage,
        tank_size: s.tank_size,
        anti_brake_system: s.anti_brake_system,
        transmission: s.transmission,
        drive_type: s.drive_type,
        engine: s.engine,
      })
      setSaved(true)
      sessionStorage.removeItem('vinology_report')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle')
    } finally {
      setSaving(false)
    }
  }

  if (!payload && !error) {
    return <p className="muted">Loading report…</p>
  }

  if (error && !payload) {
    return (
      <section className="rise" style={{ display: 'grid', gap: '1rem' }}>
        <p className="error">{error}</p>
        <Link href="/queries" className="btn btn-secondary">
          Back to queries
        </Link>
      </section>
    )
  }

  const s = payload!.specification

  return (
    <section className="rise" style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="font-display" style={{ margin: 0, fontSize: '2rem' }}>
            {s.year} {s.make}
          </h1>
          <p style={{ margin: '0.35rem 0 0' }}>{s.model}</p>
        </div>
        <div className="vin-plate font-mono">{s.vin}</div>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {saved ? <p className="panel">Saved to your query.</p> : null}

      <div className="panel" style={{ display: 'grid', gap: '0.65rem' }}>
        {[
          ['Trim', s.trim_level],
          ['Engine', s.engine],
          ['Transmission', s.transmission],
          ['Drive', s.drive_type],
          ['ABS', s.anti_brake_system],
          ['Seating', s.standard_seating],
          ['City MPG', s.city_mileage],
          ['Highway MPG', s.highway_mileage],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: 'grid',
              gridTemplateColumns: '9rem 1fr',
              gap: '0.75rem',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '0.45rem',
            }}
          >
            <span className="muted">{label}</span>
            <span>{value || '—'}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button type="button" className="btn" onClick={saveCar} disabled={saving || saved}>
          {saved ? 'Saved' : saving ? 'Saving…' : 'Save to query'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => downloadSpecPdf(s)}>
          Download PDF
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push(`/cars/new?queryId=${payload!.queryId}`)}
        >
          Another VIN
        </button>
        <Link href="/queries" className="btn btn-ghost">
          My queries
        </Link>
      </div>
    </section>
  )
}
