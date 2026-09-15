import type { VehicleSpecification } from './types'

/** Temporary client-side sample until Phase 3 wires NHTSA server-side. */
export function decodeVinMock(vin: string): VehicleSpecification {
  const cleaned = vin.trim().toUpperCase() || 'JN8DR09Y82W703284'

  return {
    vin: cleaned,
    make: 'Nissan',
    model: 'Pathfinder LE / SE',
    year: '2002',
    trim_level: 'LE',
    standard_seating: '5',
    highway_mileage: '18 miles/gallon',
    city_mileage: '15 - 16 miles/gallon',
    tank_size: null,
    anti_brake_system: '4-Wheel ABS',
    transmission: 'Automatic',
    drive_type: '4WD',
    engine: '3.5L V6 MPI',
    fuel_type: 'Gasoline',
    made_in: 'Japan',
    style: 'SUV 4D',
  }
}
