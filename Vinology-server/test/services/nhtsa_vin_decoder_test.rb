require 'test_helper'

class FakeNhtsaHttp
  def initialize(responses)
    @responses = responses
  end

  def get_json(url)
    key = @responses.keys.find { |pattern| url.include?(pattern) }
    raise Nhtsa::Client::ResponseError, "unexpected url #{url}" unless key

    payload = @responses[key]
    payload.respond_to?(:call) ? payload.call : payload
  end
end

class NhtsaVinDecoderTest < ActiveSupport::TestCase
  test 'maps vPIC decode and enriches recalls ratings complaints' do
    http = FakeNhtsaHttp.new(
      'DecodeVinValues' => {
        'Results' => [{
          'VIN' => 'JN8DR09Y82W703284',
          'Make' => 'NISSAN',
          'Model' => 'Pathfinder',
          'ModelYear' => '2002',
          'Trim' => '',
          'Series' => 'LE',
          'Seats' => '5',
          'BrakeSystemType' => 'Hydraulic',
          'TransmissionStyle' => 'Automatic',
          'DriveType' => '4WD/4-Wheel Drive/4x4',
          'DisplacementL' => '3.5',
          'EngineCylinders' => '6',
          'EngineConfiguration' => 'V-Shaped',
          'EngineModel' => 'VQ35DE',
          'FuelTypePrimary' => 'Gasoline',
          'BodyClass' => 'Sport Utility Vehicle',
          'PlantCity' => 'MIYAWAKA',
          'PlantCountry' => 'JAPAN',
          'Manufacturer' => 'NISSAN MOTOR COMPANY, LTD',
          'VehicleType' => 'MULTIPURPOSE PASSENGER VEHICLE (MPV)',
          'ErrorCode' => '0',
          'ErrorText' => '0 - VIN decoded clean.'
        }]
      },
      'recallsByVehicle' => {
        'results' => [{
          'NHTSACampaignNumber' => '20V008000',
          'Component' => 'AIR BAGS',
          'Summary' => 'Air bag inflator may explode.',
          'Consequence' => 'Injury risk',
          'Remedy' => 'Replace inflator',
          'ReportReceivedDate' => '09/01/2020'
        }]
      },
      'complaintsByVehicle' => { 'count' => 12 },
      'SafetyRatings/modelyear' => {
        'Results' => [{ 'VehicleId' => 4565, 'VehicleDescription' => '2002 Nissan Pathfinder' }]
      },
      'SafetyRatings/VehicleId' => {
        'Results' => [{
          'VehicleId' => 4565,
          'VehicleDescription' => '2002 Nissan Pathfinder',
          'OverallRating' => 'Not Rated',
          'OverallFrontCrashRating' => '4',
          'OverallSideCrashRating' => '5',
          'RolloverRating' => '3'
        }]
      }
    )

    report = Nhtsa::VinDecoder.new(http: http).call('jn8dr09y82w703284')

    assert_equal 'nhtsa', report[:source]
    assert_equal 'JN8DR09Y82W703284', report[:specification][:vin]
    assert_equal 'Nissan', report[:specification][:make]
    assert_equal 'Pathfinder', report[:specification][:model]
    assert_equal '2002', report[:specification][:year]
    assert_includes report[:specification][:engine], '3.5L'
    assert_equal 1, report[:recalls].length
    assert_equal '20V008000', report[:recalls].first[:campaign_number]
    assert_equal 12, report[:complaints_count]
    assert_equal '4', report[:safety_ratings].first[:front_crash_rating]
  end

  test 'rejects short vins' do
    assert_raises(Nhtsa::VinDecoder::DecodeError) do
      Nhtsa::VinDecoder.new(http: FakeNhtsaHttp.new({})).call('SHORT')
    end
  end
end
