# frozen_string_literal: true

module Nhtsa
  class VinDecoder
    VPIC_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles'
    API_BASE = 'https://api.nhtsa.gov'

    class DecodeError < StandardError; end

    def initialize(http: Nhtsa::Client.new)
      @http = http
    end

    def call(vin)
      normalized = normalize_vin(vin)
      raise DecodeError, 'VIN must be 11–17 characters' unless normalized.length.between?(11, 17)

      result = decode_vin(normalized)
      raise DecodeError, decode_error_message(result) if hard_failure?(result)

      make = present(result['Make'])
      model = present(result['Model'])
      year = present(result['ModelYear'])

      {
        specification: map_specification(normalized, result),
        recalls: fetch_recalls(make, model, year),
        complaints_count: fetch_complaints_count(make, model, year),
        safety_ratings: fetch_safety_ratings(make, model, year),
        source: 'nhtsa',
        decode_message: present(result['ErrorText']) || present(result['Message']) || 'OK'
      }
    end

    private

    def normalize_vin(vin)
      vin.to_s.strip.upcase.gsub(/[^A-Z0-9*]/, '')
    end

    def decode_vin(vin)
      payload = @http.get_json("#{VPIC_BASE}/DecodeVinValues/#{URI.encode_www_form_component(vin)}?format=json")
      results = payload['Results'] || payload['results']
      raise DecodeError, 'NHTSA returned no decode results' if results.blank?

      results.first
    end

    def hard_failure?(result)
      code = present(result['ErrorCode']).to_s
      # 0 = clean, 1 = check digit issues / warnings often still usable; 6+ usually bad VIN
      return true if code.split(',').map(&:strip).any? { |c| c.to_i >= 6 }
      return true if present(result['Make']).blank? && present(result['Model']).blank?

      false
    end

    def decode_error_message(result)
      present(result['ErrorText']).presence ||
        present(result['AdditionalErrorText']).presence ||
        'Unable to decode VIN with NHTSA'
    end

    def map_specification(vin, result)
      displacement = present(result['DisplacementL'])
      cylinders = present(result['EngineCylinders'])
      config = present(result['EngineConfiguration'])
      engine_model = present(result['EngineModel'])
      engine_parts = [
        (displacement ? "#{displacement}L" : nil),
        (config.present? ? config : nil),
        (cylinders ? "#{cylinders} cyl" : nil),
        engine_model
      ].compact

      {
        vin: present(result['VIN']) || vin,
        make: titleize_words(present(result['Make'])),
        model: present(result['Model']),
        year: present(result['ModelYear']),
        trim_level: present(result['Trim']).presence || present(result['Series']),
        standard_seating: present(result['Seats']),
        highway_mileage: nil,
        city_mileage: nil,
        tank_size: nil,
        anti_brake_system: present(result['BrakeSystemType']),
        transmission: present(result['TransmissionStyle']),
        drive_type: present(result['DriveType']),
        engine: engine_parts.join(' ').presence || present(result['EngineManufacturer']),
        fuel_type: present(result['FuelTypePrimary']),
        made_in: [present(result['PlantCity']), present(result['PlantCountry'])].compact.join(', ').presence,
        style: present(result['BodyClass']),
        body_class: present(result['BodyClass']),
        vehicle_type: present(result['VehicleType']),
        manufacturer: present(result['Manufacturer']),
        plant_country: present(result['PlantCountry']),
        error_code: present(result['ErrorCode']),
        error_text: present(result['ErrorText'])
      }
    end

    def fetch_recalls(make, model, year)
      return [] if make.blank? || model.blank? || year.blank?

      url = "#{API_BASE}/recalls/recallsByVehicle?make=#{q(make)}&model=#{q(model)}&modelYear=#{q(year)}"
      payload = @http.get_json(url)
      rows = payload['results'] || payload['Results'] || []
      rows.first(25).map do |row|
        {
          campaign_number: row['NHTSACampaignNumber'],
          component: row['Component'],
          summary: row['Summary'],
          consequence: row['Consequence'],
          remedy: row['Remedy'],
          report_received_date: row['ReportReceivedDate']
        }
      end
    rescue Nhtsa::Client::Error
      []
    end

    def fetch_complaints_count(make, model, year)
      return 0 if make.blank? || model.blank? || year.blank?

      url = "#{API_BASE}/complaints/complaintsByVehicle?make=#{q(make)}&model=#{q(model)}&modelYear=#{q(year)}"
      payload = @http.get_json(url)
      (payload['count'] || payload['Count'] || 0).to_i
    rescue Nhtsa::Client::Error
      0
    end

    def fetch_safety_ratings(make, model, year)
      return [] if make.blank? || model.blank? || year.blank?

      list_url = "#{API_BASE}/SafetyRatings/modelyear/#{q(year)}/make/#{q(make)}/model/#{q(model)}"
      list = @http.get_json(list_url)
      vehicles = list['Results'] || list['results'] || []
      return [] if vehicles.empty?

      vehicle_id = vehicles.first['VehicleId'] || vehicles.first['VehicleId'.downcase]
      detail = @http.get_json("#{API_BASE}/SafetyRatings/VehicleId/#{vehicle_id}")
      rows = detail['Results'] || detail['results'] || []
      rows.first(5).map do |row|
        {
          vehicle_description: row['VehicleDescription'],
          overall_rating: row['OverallRating'],
          front_crash_rating: row['OverallFrontCrashRating'],
          side_crash_rating: row['OverallSideCrashRating'],
          rollover_rating: row['RolloverRating'],
          vehicle_id: row['VehicleId']
        }
      end
    rescue Nhtsa::Client::Error
      []
    end

    def present(value)
      str = value.to_s.strip
      return nil if str.blank? || str.casecmp('not applicable').zero?

      str
    end

    def titleize_words(value)
      return nil if value.blank?

      value.split.map(&:capitalize).join(' ')
    end

    def q(value)
      URI.encode_www_form_component(value.to_s)
    end
  end
end
