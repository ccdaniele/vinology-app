require 'test_helper'

class Api::V1::AuthControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      username: 'alice',
      email: 'alice@example.com',
      name: 'Alice',
      password: 'password'
    )
  end

  test 'login returns jwt for valid credentials' do
    post '/api/v1/login', params: { user: { username: 'alice', password: 'password' } }, as: :json

    assert_response :ok
    body = JSON.parse(response.body)
    assert body['jwt'].present?
    assert_equal 'alice', body['user']['username']
    assert_nil body['user']['password']
    assert_nil body['user']['password_digest']
  end

  test 'login rejects invalid credentials' do
    post '/api/v1/login', params: { user: { username: 'alice', password: 'wrong' } }, as: :json

    assert_response :unauthorized
  end

  test 'current_user requires authentication' do
    get '/api/v1/current_user'
    assert_response :unauthorized
  end

  test 'current_user returns the logged in user' do
    get '/api/v1/current_user', headers: auth_headers_for(@user)

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal @user.id, body['id']
    assert_equal 'alice', body['username']
  end
end
