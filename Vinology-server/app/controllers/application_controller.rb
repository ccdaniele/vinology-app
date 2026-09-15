class ApplicationController < ActionController::API
  before_action :authorized

  def encode_token(payload)
    JWT.encode(
      payload.merge(exp: 24.hours.from_now.to_i),
      jwt_secret,
      'HS256'
    )
  end

  def auth_header
    request.headers['Authorization']
  end

  def decoded_token
    return unless auth_header.present?

    token = auth_header.split(' ')[1]
    return unless token.present?

    JWT.decode(token, jwt_secret, true, algorithm: 'HS256')
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end

  def current_user
    return @current_user if defined?(@current_user)

    @current_user = if decoded_token
                      User.find_by(id: decoded_token[0]['user_id'])
                    end
  end

  def logged_in?
    !!current_user
  end

  def authorized
    render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
  end

  private

  def jwt_secret
    ENV.fetch('JWT_SECRET') do
      if Rails.env.development? || Rails.env.test?
        'development_only_jwt_secret_change_me'
      else
        raise 'JWT_SECRET environment variable is required'
      end
    end
  end
end
