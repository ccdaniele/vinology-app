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
  trim_level: string | null
  standard_seating: string | null
  highway_mileage: string | null
  city_mileage: string | null
  tank_size: string | null
  anti_brake_system: string | null
  transmission: string | null
  drive_type: string | null
  engine: string | null
  fuel_type?: string | null
  made_in?: string | null
  style?: string | null
  body_class?: string | null
  vehicle_type?: string | null
  manufacturer?: string | null
  plant_country?: string | null
  error_code?: string | null
  error_text?: string | null
}

export type Recall = {
  campaign_number: string | null
  component: string | null
  summary: string | null
  consequence: string | null
  remedy: string | null
  report_received_date: string | null
}

export type SafetyRating = {
  vehicle_description: string | null
  overall_rating: string | null
  front_crash_rating: string | null
  side_crash_rating: string | null
  rollover_rating: string | null
  vehicle_id: number | null
}

export type VinLookupReport = {
  specification: VehicleSpecification
  recalls: Recall[]
  complaints_count: number
  safety_ratings: SafetyRating[]
  source: string
  decode_message: string
}

export type ApiErrorBody = {
  message?: string
  error?: string | string[]
}
