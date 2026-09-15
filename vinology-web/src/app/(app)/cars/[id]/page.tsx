'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { downloadSpecPdf } from '@/lib/pdf'
import type { Car, VehicleSpecification } from '@/lib/types'

function carToSpec(car: Car): VehicleSpecification {
  return {
    vin: car.vin_number,
    make: car.make || '',
    model: car.model || '',
    year: car.year || '',
    trim_level: car.trim_level || '',
    standard_seating: car.standard_seating || '',
    highway_mileage: car.highway_mileage || '',
    city_mileage: car.city_mileage || '',
    tank_size: car.tank_size,
    anti_brake_system: car.anti_brake_system || '',
    transmission: car.transmission || '',
    drive_type: car.drive_type || '',
    engine: car.engine || '',
  }
}

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

  return (
    <section className="rise" style={{ display: 'grid', gap: '1.25rem', maxWidth: 640 }}>
      <div>
        <h1 className="font-display" style={{ margin: 0, fontSize: '2rem' }}>
          {car.year} {car.make}
        </h1>
        <p style={{ margin: '0.35rem 0 0' }}>{car.model}</p>
      </div>
      <div className="vin-plate font-mono">{car.vin_number}</div>
      {error ? <p className="error">{error}</p> : null}
      <div className="panel" style={{ display: 'grid', gap: '0.55rem' }}>
        <div><span className="muted">Engine</span> · {car.engine || '—'}</div>
        <div><span className="muted">Transmission</span> · {car.transmission || '—'}</div>
        <div><span className="muted">Drive</span> · {car.drive_type || '—'}</div>
        <div><span className="muted">City</span> · {car.city_mileage || '—'}</div>
        <div><span className="muted">Highway</span> · {car.highway_mileage || '—'}</div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn" onClick={() => downloadSpecPdf(carToSpec(car))}>
          Download PDF
        </button>
        <button type="button" className="btn btn-secondary" onClick={onDelete}>
          Delete
        </button>
        <Link href="/queries" className="btn btn-ghost">
          Back
        </Link>
      </div>
    </section>
  )
}
