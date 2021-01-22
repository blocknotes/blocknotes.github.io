# frozen_string_literal: true

require 'open-uri'

describe 'check links in sitemap', type: :feature do
  sitemap = URI.open("#{Capybara.app_host}/sitemap.xml").read
  links = sitemap.split("\n").select { |line| line.start_with? '<loc>' }
  links.each do |loc|
    tokens = loc.match(%r{<loc>(.+)</loc>})
    page_url = tokens ? tokens[1] : nil
    next if !page_url || page_url =~ /[\d{3}]\.html/

    it "visit #{page_url}" do
      visit "#{page_url}?#{QUERY_SKIP_PARAM}"
      expect(page).not_to have_title '404 - Page not found'
      expect(page).to have_css 'a.navbar-brand', text: 'blocknot.es'
      expect(page).to have_css '.beautiful-jekyll-footer'
    end
  end
end
