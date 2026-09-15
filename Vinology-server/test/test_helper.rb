ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/mock'

module AuthHelper
  def auth_headers_for(user)
    token = JWT.encode(
      { user_id: user.id, exp: 24.hours.from_now.to_i },
      jwt_test_secret,
      'HS256'
    )
    { 'Authorization' => "Bearer #{token}", 'Content-Type' => 'application/json' }
  end

  def jwt_test_secret
    ENV.fetch('JWT_SECRET', 'development_only_jwt_secret_change_me')
  end
end

class ActiveSupport::TestCase
  parallelize(workers: :number_of_processors)
  include AuthHelper
end

class ActionDispatch::IntegrationTest
  include AuthHelper
end
