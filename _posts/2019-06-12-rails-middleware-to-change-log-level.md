---
title: 'A Rails middleware to change log level at runtime'
image: /assets/img/img-ruby-on-rails.png
tags: ruby rails
excerpt: Have you ever found the Rails logs too verbose in development? Here it is a small middleware to do it
canonical: 'https://nebulab.it/blog/rails-middleware-change-log-level/'
---

Have you ever found the Rails logs too verbose in development?

When working on a Rails application, 
you don't always need that amount of  detail in your logs. From time to time, 
a less verbose log is more than enough, especially after a long day coding.
To change the log level by editing the settings is easy but you will also need 
to restart the server. And in some situations, it would be helpful to 
change the verbosity from request to request.

For this reason, in this article, we will see how to create a small middleware 
to change the log level at runtime.

A Rack middleware is a component that can filter/process/change either a 
request or a response by inserting some code in the request/response cycle. 
For more information on this topic, the Rails guide is a nice starting point: 
[Action Dispatcher Middleware Stack](https://guides.rubyonrails.org/rails_on_rack.html#action-dispatcher-middleware-stack).

In a basic Rails middleware there are 2 methods: `initialize` that is used to 
keep a reference to the current application and `call` which is invoked when a 
request arrives. The latter receives the context of the request that can be 
parsed easily using the `Rack::Request` class. At the end of our method we 
need to invoke the `call` method of the Rails app to allow the chain to go on 
or we can return a Rack response composed by status code, headers, and content.

To change the log level we can intercept a specific route (for example `/dev`) 
and serve a minimal interface from which we can check if a logging parameter 
is sent and change the log level as requested.

Here you find a small example:

```ruby
  class RuntimeConfTool
    LOGGER_SEVERITY = %w[debug info warn error fatal unknown].freeze

    def initialize(app)
      @app = app
    end

    def call(env)
      req = Rack::Request.new(env)
      return @app.call(env) unless req.path == '/dev'

      if LOGGER_SEVERITY.include?((req.params['log'] || '').downcase)
        level = "Logger::#{req.params['log'].upcase}"
        Rails.logger.level = level.constantize
        @message = "Logger level set to: #{level}"
      end

      [200, { 'Content-Type' => 'text/html' }, [
        ERB.new(<<~ERB_DOC
          <html><body>
          <h3>Runtime Rails Tools</h3>
            Set log level to: <%= RuntimeConfTool::LOGGER_SEVERITY.map{ |level| '<a class="button" href="?log=' + level + '">' + level + '</a>' }.join(' ') %>
            <br/><em><%= @message %></em>
          </body></html>
        ERB_DOC
              ).result(binding)
      ]]
    end
  end
```

To enable our middleware we need to change 
`config/environments/development.rb` by adding this line: 
`config.middleware.use RuntimeConfTool`. And using `rake middleware` from the 
console it's possible to see our new component in the list of the current 
active middlewares.

From this point, we could do a lot of things like changing other settings 
(controlling the cache, enabling/disabling errors catching, etc.), here you 
can find a small project with this purpose in mind: 
[Rails Runtime Config](https://github.com/nebulab/runtime_config).

![Rails Runtime Config Screenshot](/assets/img/screenshot-rails-runtime-config.jpg)
