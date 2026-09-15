require 'test_helper'

class Api::V1::QueriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @owner = User.create!(username: 'owner', email: 'owner@example.com', password: 'password')
    @other = User.create!(username: 'other', email: 'other@example.com', password: 'password')
    @owned_query = @owner.queries.create!(name: 'Mine')
    @other_query = @other.queries.create!(name: 'Theirs')
  end

  test 'index requires authentication' do
    get '/api/v1/queries'
    assert_response :unauthorized
  end

  test 'index only returns current user queries' do
    get '/api/v1/queries', headers: auth_headers_for(@owner)

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal ['Mine'], body.map { |q| q['name'] }
  end

  test 'create assigns ownership to current user' do
    assert_difference -> { @owner.queries.count }, 1 do
      post '/api/v1/queries',
           params: { query: { name: 'New research', user_id: @other.id } },
           headers: auth_headers_for(@owner),
           as: :json
    end

    assert_response :created
    body = JSON.parse(response.body)
    assert_equal 'New research', body['name']
    assert_equal @owner.id, body['user_id']
  end

  test 'cannot update another users query' do
    patch "/api/v1/queries/#{@other_query.id}",
          params: { query: { name: 'Hacked' } },
          headers: auth_headers_for(@owner),
          as: :json

    assert_response :not_found
    assert_equal 'Theirs', @other_query.reload.name
  end

  test 'cannot destroy another users query' do
    assert_no_difference -> { Query.count } do
      delete "/api/v1/queries/#{@other_query.id}", headers: auth_headers_for(@owner)
    end

    assert_response :not_found
  end
end
