require 'test_helper'

class Api::V1::VinLookupsControllerTest < ActionDispatch::IntegrationTest
  setup do
    RateLimiter.reset!
    @user = User.create!(username: 'vinuser', email: 'vin@example.com', password: 'password')
  end

  def fake_decoder(report = nil)
    report ||= {
      specification: {
        vin: 'JN8DR09Y82W703284',
        make: 'Nissan',
        model: 'Pathfinder',
        year: '2002',
        trim_level: 'LE',
        standard_seating: '5',
        highway_mileage: nil,
        city_mileage: nil,
        tank_size: nil,
        anti_brake_system: 'Hydraulic',
        transmission: 'Automatic',
        drive_type: '4WD',
        engine: '3.5L V6'
      },
      recalls: [],
      complaints_count: 0,
      safety_ratings: [],
      source: 'nhtsa',
      decode_message: 'ok'
    }

    decoder = Object.new
    decoder.define_singleton_method(:call) { |_vin| report }
    decoder
  end

  test 'requires authentication' do
    post '/api/v1/vin_lookups', params: { vin: 'JN8DR09Y82W703284' }, as: :json
    assert_response :unauthorized
  end

  test 'returns decoded report for authenticated user' do
    Nhtsa::VinDecoder.stub(:new, ->(*) { fake_decoder }) do
      post '/api/v1/vin_lookups',
           params: { vin: 'JN8DR09Y82W703284' },
           headers: auth_headers_for(@user),
           as: :json
    end

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal 'Nissan', body['specification']['make']
    assert_equal 'nhtsa', body['source']
  end

  test 'rate limits repeated lookups' do
    previous_limit = ENV['VIN_LOOKUP_RATE_LIMIT']
    previous_period = ENV['VIN_LOOKUP_RATE_PERIOD']
    ENV['VIN_LOOKUP_RATE_LIMIT'] = '2'
    ENV['VIN_LOOKUP_RATE_PERIOD'] = '3600'

    Nhtsa::VinDecoder.stub(:new, ->(*) { fake_decoder }) do
      2.times do
        post '/api/v1/vin_lookups',
             params: { vin: 'JN8DR09Y82W703284' },
             headers: auth_headers_for(@user),
             as: :json
        assert_response :ok
      end

      post '/api/v1/vin_lookups',
           params: { vin: 'JN8DR09Y82W703284' },
           headers: auth_headers_for(@user),
           as: :json
      assert_response :too_many_requests
    end
  ensure
    ENV['VIN_LOOKUP_RATE_LIMIT'] = previous_limit
    ENV['VIN_LOOKUP_RATE_PERIOD'] = previous_period
    RateLimiter.reset!
  end
end
