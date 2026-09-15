import type { Car, VinLookupReport } from './types'

/** Rebuild a full report view from a saved car (+ optional stored NHTSA payload). */
export function reportFromCar(car: Car): VinLookupReport {
  const payload = car.report_payload || {}
  const fromPayload = payload.specification

  return {
    specification: {
      vin: fromPayload?.vin || car.vin_number,
      make: fromPayload?.make || car.make || '',
      model: fromPayload?.model || car.model || '',
      year: fromPayload?.year || car.year || '',
      trim_level: fromPayload?.trim_level ?? car.trim_level,
      standard_seating: fromPayload?.standard_seating ?? car.standard_seating,
      highway_mileage: fromPayload?.highway_mileage ?? car.highway_mileage,
      city_mileage: fromPayload?.city_mileage ?? car.city_mileage,
      tank_size: fromPayload?.tank_size ?? car.tank_size,
      anti_brake_system: fromPayload?.anti_brake_system ?? car.anti_brake_system,
      transmission: fromPayload?.transmission ?? car.transmission,
      drive_type: fromPayload?.drive_type ?? car.drive_type,
      engine: fromPayload?.engine ?? car.engine,
      fuel_type: fromPayload?.fuel_type ?? null,
      made_in: fromPayload?.made_in ?? null,
      style: fromPayload?.style ?? fromPayload?.body_class ?? null,
      body_class: fromPayload?.body_class ?? null,
      vehicle_type: fromPayload?.vehicle_type ?? null,
      manufacturer: fromPayload?.manufacturer ?? null,
      plant_country: fromPayload?.plant_country ?? null,
      error_code: fromPayload?.error_code ?? null,
      error_text: fromPayload?.error_text ?? null,
    },
    recalls: payload.recalls || [],
    complaints_count: payload.complaints_count || 0,
    safety_ratings: payload.safety_ratings || [],
    source: payload.source || 'nhtsa',
    decode_message: payload.decode_message || 'Saved report',
  }
}
