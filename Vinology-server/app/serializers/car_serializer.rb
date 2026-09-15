# frozen_string_literal: true

class CarSerializer
  ATTRIBUTES = %i[
    id
    query_id
    vin_number
    model
    make
    year
    highway_mileage
    transmission
    city_mileage
    trim_level
    anti_brake_system
    drive_type
    engine
    standard_seating
    tank_size
    TitleIssuingAuthorityName
    VehicleOdometerReadingMeasure
    historyInformationlength
    brandsRecordCount
    adjustedCleanRetail
    adjustedAverageTrade
    averageMileage
    maxMileageAdj
    report_payload
  ].freeze

  def initialize(car)
    @car = car
  end

  def as_json(*)
    ATTRIBUTES.index_with { |attr| @car.public_send(attr) }
  end
end
