import { jsPDF } from 'jspdf'
import type { VehicleSpecification } from './types'

export function downloadSpecPdf(spec: VehicleSpecification) {
  const doc = new jsPDF('p', 'pt')
  const lines = [
    'Vinology report',
    '',
    `VIN: ${spec.vin}`,
    `Make: ${spec.make}`,
    `Model: ${spec.model}`,
    `Year: ${spec.year}`,
    `Trim: ${spec.trim_level}`,
    `Seating: ${spec.standard_seating}`,
    `Highway: ${spec.highway_mileage}`,
    `City: ${spec.city_mileage}`,
    `Tank: ${spec.tank_size ?? '—'}`,
    `ABS: ${spec.anti_brake_system}`,
    `Transmission: ${spec.transmission}`,
    `Drive: ${spec.drive_type}`,
    `Engine: ${spec.engine}`,
  ]

  let y = 40
  lines.forEach((line) => {
    doc.text(line, 40, y)
    y += 22
  })

  doc.save(`${spec.make}-${spec.model}-vinology.pdf`.replace(/\s+/g, '-'))
}
