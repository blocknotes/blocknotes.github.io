# frozen_string_literal: true

require 'capybara/rspec'

QUERY_SKIP_PARAM='_noga=1' # parameters used to skip Google Analytics

Capybara.configure do |config|
  config.default_driver = :selenium_headless
  config.app_host = 'https://www.blocknot.es'
  config.run_server = false
end

RSpec.configure do |config|
end
