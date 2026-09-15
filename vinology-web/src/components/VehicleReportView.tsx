'use client'

import type { Recall, SafetyRating, VehicleSpecification, VinLookupReport } from '@/lib/types'

function SpecRows({ spec }: { spec: VehicleSpecification }) {
  const rows: Array<[string, string | null | undefined]> = [
    ['Trim', spec.trim_level],
    ['Body', spec.style || spec.body_class],
    ['Engine', spec.engine],
    ['Fuel', spec.fuel_type],
    ['Transmission', spec.transmission],
    ['Drive', spec.drive_type],
    ['Brakes', spec.anti_brake_system],
    ['Seating', spec.standard_seating],
    ['Built', spec.made_in],
    ['Manufacturer', spec.manufacturer],
  ]

  return (
    <div className="panel" style={{ display: 'grid', gap: '0.65rem' }}>
      {rows.map(([label, value]) => (
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
  )
}

function SafetyBlock({
  complaintsCount,
  ratings,
}: {
  complaintsCount: number
  ratings: SafetyRating[]
}) {
  return (
    <div className="panel" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Safety snapshot</h2>
      <p className="muted" style={{ margin: 0 }}>
        NHTSA consumer complaints on file for this make/model/year: <strong>{complaintsCount}</strong>
      </p>
      {ratings.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>
          No crash-test rating card matched for this vehicle.
        </p>
      ) : (
        ratings.map((rating) => (
          <div key={`${rating.vehicle_id}-${rating.vehicle_description}`} style={{ display: 'grid', gap: '0.35rem' }}>
            <strong>{rating.vehicle_description}</strong>
            <span className="muted">
              Overall {rating.overall_rating || '—'} · Front {rating.front_crash_rating || '—'} · Side{' '}
              {rating.side_crash_rating || '—'} · Rollover {rating.rollover_rating || '—'}
            </span>
          </div>
        ))
      )}
    </div>
  )
}

function RecallsBlock({ recalls }: { recalls: Recall[] }) {
  return (
    <div className="panel" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Recalls ({recalls.length})</h2>
      {recalls.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>
          No open recall campaigns returned for this configuration.
        </p>
      ) : (
        recalls.map((recall) => (
          <article
            key={recall.campaign_number || recall.summary}
            style={{ borderTop: '1px solid var(--line)', paddingTop: '0.75rem', display: 'grid', gap: '0.35rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
              <strong className="font-mono">{recall.campaign_number}</strong>
              <span className="muted">{recall.report_received_date}</span>
            </div>
            <div>{recall.component}</div>
            <p style={{ margin: 0, lineHeight: 1.5 }}>{recall.summary}</p>
          </article>
        ))
      )}
    </div>
  )
}

export function VehicleReportView({
  report,
  actions,
}: {
  report: VinLookupReport
  actions?: React.ReactNode
}) {
  const spec = report.specification
  const recalls = report.recalls || []
  const ratings = report.safety_ratings || []

  return (
    <section className="rise" style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="font-display" style={{ margin: 0, fontSize: '2rem' }}>
            {spec.year} {spec.make}
          </h1>
          <p style={{ margin: '0.35rem 0 0' }}>{spec.model}</p>
          <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
            Source: {(report.source || 'nhtsa').toUpperCase()}
            {report.decode_message ? ` · ${report.decode_message}` : ''}
          </p>
        </div>
        <div className="vin-plate font-mono">{spec.vin}</div>
      </div>

      <SpecRows spec={spec} />
      <SafetyBlock complaintsCount={report.complaints_count || 0} ratings={ratings} />
      <RecallsBlock recalls={recalls} />

      {actions ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>{actions}</div> : null}
    </section>
  )
}
