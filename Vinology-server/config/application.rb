require_relative "boot"

require "rails"
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
require "rails/test_unit/railtie"
require "lograge"

Bundler.require(*Rails.groups)

module VinServer
  class Application < Rails::Application
    config.load_defaults 7.2

    config.api_only = true

    config.lograge.enabled = true
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.colorize_logging = false
    config.lograge.logger = ActiveSupport::Logger.new(Rails.root.join("log", "#{Rails.env}.log"))
  end
end
