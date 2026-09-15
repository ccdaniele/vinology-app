require 'test_helper'

class Api::V1::CarsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @owner = User.create!(username: 'owner', email: 'owner@example.com', password: 'password')
    @other = User.create!(username: 'other', email: 'other@example.com', password: 'password')
    @owned_query = @owner.queries.create!(name: 'Mine')
    @other_query = @other.queries.create!(name: 'Theirs')
    @other_car = @other_query.cars.create!(vin_number: '1HGCM82633A004352', make: 'Honda', model: 'Accord')
  end

  test 'create requires authentication' do
    post '/api/v1/cars', params: { car: { query_id: @owned_query.id, vin_number: 'ABC' } }, as: :json
    assert_response :unauthorized
  end

  test 'create saves car on owned query' do
    post '/api/v1/cars',
         params: {
           car: {
             query_id: @owned_query.id,
             vin_number: '5YJSA1E26HF000001',
             make: 'Tesla',
             model: 'Model S',
             year: '2017'
           }
         },
         headers: auth_headers_for(@owner),
         as: :json

    assert_response :created
    body = JSON.parse(response.body)
    assert_equal 'Tesla', body['make']
    assert_equal @owned_query.id, body['query_id']
  end

  test 'cannot create car on another users query' do
    post '/api/v1/cars',
         params: { car: { query_id: @other_query.id, vin_number: '5YJSA1E26HF000001' } },
         headers: auth_headers_for(@owner),
         as: :json

    assert_response :not_found
  end

  test 'cannot show or destroy another users car' do
    get "/api/v1/cars/#{@other_car.id}", headers: auth_headers_for(@owner)
    assert_response :not_found

    assert_no_difference -> { Car.count } do
      delete "/api/v1/cars/#{@other_car.id}", headers: auth_headers_for(@owner)
    end
    assert_response :not_found
  end
end
