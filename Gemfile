source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'nokogiri', '>= 1.10.4'

# gem 'github-pages', versions['github-pages']
gem 'github-pages', '~> 193'
gem 'jekyll-sitemap', '~> 1.2.0'

group :jekyll_plugins do
  gem 'jekyll-admin', '~> 0.8.0'
end
