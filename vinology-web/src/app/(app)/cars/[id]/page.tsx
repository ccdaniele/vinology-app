'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { downloadSpecPdf } from '@/lib/pdf'
import { reportFromCar } from '@/lib/reportFromCar'
import type { Car } from '@/lib/types'
import { VehicleReportView } from '@/components/VehicleReportView'

export default function CarDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = Number(params.id)
    if (!Number.isFinite(id)) return
    api
      .getCar(id)
      .then(setCar)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load car'))
  }, [params.id])

  async function onDelete() {
    if (!car) return
    try {
      await api.deleteCar(car.id)
      router.push('/queries')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (error && !car) {
    return <p className="error">{error}</p>
  }

  if (!car) {
    return <p className="muted">Loading vehicle…</p>
  }

  const report = reportFromCar(car)

  return (
    <>
      {error ? <p className="error" style={{ marginBottom: '1rem' }}>{error}</p> : null}
      <VehicleReportView
        report={report}
        actions={
          <>
            <button
              type="button"
              className="btn"
              onClick={() =>
                downloadSpecPdf(report.specification, {
                  recalls: report.recalls,
                  complaintsCount: report.complaints_count,
                })
              }
            >
              Download PDF
            </button>
            <button type="button" className="btn btn-secondary" onClick={onDelete}>
              Delete
            </button>
            <Link href="/queries" className="btn btn-ghost">
              Back
            </Link>
          </>
        }
      />
    </>
  )
}
