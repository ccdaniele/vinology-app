require_relative "boot"
# require 'datadog/statsd'
require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
require "rails/test_unit/railtie"
require 'lograge'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module VinServer
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    # Lograge config
    config.lograge.enabled = true

    # This specifies to log in JSON format
    config.lograge.formatter = Lograge::Formatters::Json.new

    ## Disables log coloration
    config.colorize_logging = false

    # Log to a dedicated file
    config.lograge.logger = ActiveSupport::Logger.new(File.join(Rails.root, 'log', "#{Rails.env}.log"))

    # This is useful if you want to log query parameters
    # config.lograge.custom_options = lambda do |event|
    #     { :ddsource => 'ruby',
    #       :params => event.payload[:params].reject { |k| %w(controller action).include? k }
    #     }
    # end

    # Rails.application.secrets
    # # Create a DogStatsD client instance.
    # statsd = Datadog::Statsd.new('localhost', 8125)

  end
end
