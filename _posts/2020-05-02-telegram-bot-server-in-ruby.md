---
title: 'A Telegram bot server in Ruby'
tags: project ruby
image: /assets/img/img-ruby.jpg
share-img: /assets/img/img-ruby_md.jpg
thumbnail-img: /assets/img/img-ruby_sm.jpg
excerpt: A Telegram Bot server in Ruby on Heroku using webhooks
---

Recently I made some experiments with Telegram bots in Ruby.

From [Telegram Bots API](https://core.telegram.org/bots/api), there are 2
methods to receive incoming updates:
- `getUpdates`: using long polling;
- `setWebhook`: setting an URL that will receive the requests.

Creating a bot with the first method is easily done using a Telegram client
library like [telegram-bot-ruby](https://github.com/atipugin/telegram-bot-ruby),
in this case the bot app will continue to ask for updates to Telegram.
While the second way lets Telegram send requests to your server when needed, I
prefer this one.

The steps to do it are the following:
- create a new bot via **@BotFather**'s command `/newbot`;
- setup and run your bot server application (in my case a Ruby Rack app);
- set your server url to receive updates using the `setWebhook` Telegram's
endpoint.

The bot server app handles POST requests, parse the received text messages and
calls the Telegram API for interaction.

```ruby
  def call(env)
    if env['REQUEST_METHOD'] == 'POST'
      req = Rack::Request.new(env)
      data = JSON.parse(req.body.read)
      text = data&.dig('message', 'text')
      chat_id = data&.dig('message', 'chat', 'id')
      if text == '/hello'
        # Use telegram-bot-ruby gem to respond back
        @telegram_api.send_message(chat_id: chat_id, text: 'Hello to you')
      end
      [204, {}, ['']]
    end
  end
```

For more details about the code I prepared a project with some instructions that
can be deployed to Heroku:
[telegram-bot-server-ruby](https://github.com/blocknotes/telegram-bot-server-ruby)

I have attached the New Relic APM dyno which can be configured to run a
scheduled heartbeat check if needed. A useful plus is also the Sentry dyno to
debug exceptions easily.

Bot testing screenshot:

![bot screenshot](/assets/img/screenshot-telegram-bot-server-in-ruby.png)

Feel free to leave me a comment to improve this project.
