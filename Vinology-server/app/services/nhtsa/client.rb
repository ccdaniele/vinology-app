# frozen_string_literal: true

require 'json'
require 'net/http'
require 'uri'

module Nhtsa
  class Client
    class Error < StandardError; end
    class TimeoutError < Error; end
    class ResponseError < Error; end

    DEFAULT_OPEN_TIMEOUT = 5
    DEFAULT_READ_TIMEOUT = 10

    def initialize(open_timeout: DEFAULT_OPEN_TIMEOUT, read_timeout: DEFAULT_READ_TIMEOUT)
      @open_timeout = open_timeout
      @read_timeout = read_timeout
    end

    def get_json(url)
      uri = URI(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.open_timeout = @open_timeout
      http.read_timeout = @read_timeout

      request = Net::HTTP::Get.new(uri)
      request['Accept'] = 'application/json'
      request['User-Agent'] = 'Vinology/1.0 (portfolio demo)'

      response = http.request(request)
      unless response.is_a?(Net::HTTPSuccess)
        raise ResponseError, "NHTSA HTTP #{response.code} for #{uri.request_uri}"
      end

      JSON.parse(response.body)
    rescue Net::OpenTimeout, Net::ReadTimeout, Timeout::Error => e
      raise TimeoutError, e.message
    rescue JSON::ParserError => e
      raise ResponseError, "Invalid JSON from NHTSA: #{e.message}"
    end
  end
end
