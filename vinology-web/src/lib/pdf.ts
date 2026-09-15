import { jsPDF } from 'jspdf'
import type { Recall, VehicleSpecification } from './types'

export function downloadSpecPdf(
  spec: VehicleSpecification,
  extras?: { recalls?: Recall[]; complaintsCount?: number }
) {
  const doc = new jsPDF('p', 'pt')
  const lines = [
    'Vinology report',
    'Source: NHTSA',
    '',
    `VIN: ${spec.vin}`,
    `Make: ${spec.make}`,
    `Model: ${spec.model}`,
    `Year: ${spec.year}`,
    `Trim: ${spec.trim_level || '—'}`,
    `Body: ${spec.style || spec.body_class || '—'}`,
    `Engine: ${spec.engine || '—'}`,
    `Fuel: ${spec.fuel_type || '—'}`,
    `Transmission: ${spec.transmission || '—'}`,
    `Drive: ${spec.drive_type || '—'}`,
    `Brakes: ${spec.anti_brake_system || '—'}`,
    `Built: ${spec.made_in || '—'}`,
    '',
    `NHTSA complaints (make/model/year): ${extras?.complaintsCount ?? '—'}`,
    `Recalls listed: ${extras?.recalls?.length ?? 0}`,
  ]

  let y = 40
  const write = (text: string) => {
    const wrapped = doc.splitTextToSize(text, 520)
    doc.text(wrapped, 40, y)
    y += wrapped.length * 16 + 6
    if (y > 740) {
      doc.addPage()
      y = 40
    }
  }

  lines.forEach(write)

  ;(extras?.recalls || []).slice(0, 8).forEach((recall) => {
    write('')
    write(`Campaign ${recall.campaign_number || '—'}`)
    write(recall.component || '')
    write(recall.summary || '')
  })

  doc.save(`${spec.make}-${spec.model}-vinology.pdf`.replace(/\s+/g, '-'))
}
