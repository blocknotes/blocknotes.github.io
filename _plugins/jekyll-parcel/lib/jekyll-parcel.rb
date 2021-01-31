# frozen_string_literal: true

require 'jekyll'
require 'listen'

module Jekyll
  class Parcel
    class << self
      DEFAULT_BUILD = 'parcel build --no-source-maps --log-level 2 --out-dir assets src/index.js'
      DEFAULT_PATH = 'src'

      def process_assets(site)
        Jekyll.logger.info 'Jekyll-parcel init'
        config = plugin_config(site)
        system(config['init']) if config['init']
        builds = config['builds'].each_with_object({}) do |build, hash|
          hash[build['path']] = build['script']
        end
        watch_for_changes(builds)
      end

      def plugin_config(site)
        @config ||= begin
          (site.config["jekyll-parcel"] || {}).tap do |config|
            config['init'] ||= DEFAULT_BUILD
            config['builds'] ||= [{ 'script' => DEFAULT_BUILD, 'path' => DEFAULT_PATH }]
          end
        end
      end

      def watch_for_changes(builds)
        return if builds.empty?

        listener = Listen.to(*(builds.keys)) do |modified, added, removed|
          changes = modified + added + removed
          builds.each do |path, script|
            system(script) if script && changes.any? { |change| change.include?(path) }
          end
        end
        listener.start
      end
    end
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  Jekyll::Parcel.process_assets(site)
end
