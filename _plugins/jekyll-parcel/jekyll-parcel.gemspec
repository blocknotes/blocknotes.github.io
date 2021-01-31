# frozen_string_literal: true

require_relative "lib/jekyll-parcel/version"

Gem::Specification.new do |s|
  s.name        = "jekyll-parcel"
  s.summary     = "jekyll-parcel"
  s.version     = Jekyll::JekyllParcel::VERSION
  s.authors     = ["Mat"]
  s.email       = "mat@blocknot.es"

  s.homepage = "https://github.com/"
  s.licenses = ["MIT"]
  s.files    = ["lib/jekyll-parcel.rb"]

  s.required_ruby_version = ">= 2.4.0"

  s.add_dependency "jekyll", ">= 3.0", "< 5.0"
  s.add_dependency "listen", "~> 3.0"

  s.add_development_dependency "bundler"
  s.add_development_dependency "rake", "~> 12.0"
  s.add_development_dependency "rspec", "~> 3.0"
  s.add_development_dependency "rubocop-jekyll", "~> 0.4"
end
