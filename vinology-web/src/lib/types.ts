export type User = {
  id: number
  name: string | null
  username: string
  email: string
}

export type Car = {
  id: number
  query_id: number
  vin_number: string
  model: string | null
  make: string | null
  year: string | null
  highway_mileage: string | null
  transmission: string | null
  city_mileage: string | null
  trim_level: string | null
  anti_brake_system: string | null
  drive_type: string | null
  engine: string | null
  standard_seating: string | null
  tank_size: string | null
  TitleIssuingAuthorityName?: string | null
  VehicleOdometerReadingMeasure?: string | null
  historyInformationlength?: string | null
  brandsRecordCount?: number | null
  adjustedCleanRetail?: string | null
  adjustedAverageTrade?: string | null
  averageMileage?: string | null
  maxMileageAdj?: string | null
}

export type Query = {
  id: number
  name: string
  user_id: number
  cars: Car[]
}

export type AuthResponse = {
  user: User
  jwt: string
}

export type VehicleSpecification = {
  vin: string
  make: string
  model: string
  year: string
  trim_level: string
  standard_seating: string
  highway_mileage: string
  city_mileage: string
  tank_size: string | null
  anti_brake_system: string
  transmission: string
  drive_type: string
  engine: string
  fuel_type?: string
  made_in?: string
  style?: string
}

export type ApiErrorBody = {
  message?: string
  error?: string | string[]
}
