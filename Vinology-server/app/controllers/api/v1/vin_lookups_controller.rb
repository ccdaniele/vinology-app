# frozen_string_literal: true

class Api::V1::VinLookupsController < ApplicationController
  # Authenticated VIN decode via free NHTSA APIs (no API key).
  def create
    unless RateLimiter.allow?(
      "vin_lookup:#{current_user.id}",
      limit: ENV.fetch('VIN_LOOKUP_RATE_LIMIT', '30').to_i,
      period: ENV.fetch('VIN_LOOKUP_RATE_PERIOD', '3600').to_i
    )
      return render json: { error: 'VIN lookup rate limit exceeded. Try again later.' }, status: :too_many_requests
    end

    vin = params.require(:vin)
    report = Nhtsa::VinDecoder.new.call(vin)
    render json: report, status: :ok
  rescue ActionController::ParameterMissing
    render json: { error: 'vin is required' }, status: :unprocessable_entity
  rescue Nhtsa::VinDecoder::DecodeError => e
    render json: { error: e.message }, status: :unprocessable_entity
  rescue Nhtsa::Client::TimeoutError
    render json: { error: 'NHTSA timed out. Please try again.' }, status: :gateway_timeout
  rescue Nhtsa::Client::Error => e
    render json: { error: "NHTSA request failed: #{e.message}" }, status: :bad_gateway
  end
end
