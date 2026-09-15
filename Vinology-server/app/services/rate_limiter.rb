# frozen_string_literal: true

# Simple per-process rate limiter (good enough for a portfolio demo).
module RateLimiter
  @mutex = Mutex.new
  @hits = Hash.new { |hash, key| hash[key] = [] }

  module_function

  def allow?(key, limit:, period:)
    @mutex.synchronize do
      now = Process.clock_gettime(Process::CLOCK_MONOTONIC)
      window_start = now - period
      @hits[key].reject! { |timestamp| timestamp < window_start }
      return false if @hits[key].length >= limit

      @hits[key] << now
      true
    end
  end

  def reset!
    @mutex.synchronize { @hits.clear }
  end
end
