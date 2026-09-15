# frozen_string_literal: true

class HealthController < ApplicationController
  skip_before_action :authorized

  def show
    render json: {
      app: 'Vinology API',
      status: 'ok',
      api_base: '/api/v1'
    }
  end
end
