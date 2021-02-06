---
title: 'Docker Rails 6 dev environment setup'
tags: ruby rails
image: /assets/img/img-ruby-on-rails.png
share-img: /assets/img/img-ruby-on-rails_md.png
thumbnail-img: /assets/img/img-ruby-on-rails_sm.png
excerpt: Setup Ruby on Rails development using Docker
---

Recently I made some experiments to setup a Rails 6 dev environment using Docker.<br/>
I started from the Docker's [quick start](https://docs.docker.com/compose/rails/).

## Dockerfile

I install some extra packages like *chromium-chromedriver* for feature specs.

```dockerfile
# Base image
FROM ruby:2.7.2-alpine

# Install required packages and tools
RUN apk add --no-cache --update build-base chromium chromium-chromedriver nano nodejs npm postgresql-client postgresql-dev sqlite sqlite-dev tzdata
RUN npm install -g yarn

# Setup the entrypoint script
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# Copy project files
WORKDIR /project
COPY project /project

# Command entrypoint
ENTRYPOINT ["entrypoint.sh"]
```

## docker-compose.yml

For a multi projects environment it can be useful to keep a shared volume for the gems:

```yml
version: "3.8"

## Setup
# mkdir -p /Users/mat/containers/common/nodejs-12.18.4/node_modules
# mkdir -p /Users/mat/containers/common/ruby-2.7.2/bundle
# docker volume create --driver local --opt type=none --opt o=bind --opt device=/Users/mat/containers/common/nodejs-12.18.4/node_modules nodejs-12.18.4-node_modules
# docker volume create --driver local --opt type=none --opt o=bind --opt device=/Users/mat/containers/common/ruby-2.7.2/bundle ruby-2.7.2-bundle

x-defaults:
  app: &default_app
    environment: &enviroments
      RAILS_ENV: development
    user: "${UID}:${GID}"

services:
  db:
    environment:
      POSTGRES_HOST_AUTH_METHOD: trust
      POSTGRES_USER: postgres
    image: postgres:13-alpine

  redis:
    image: redis:6-alpine
    volumes:
      - ${PWD}/config/redis.conf:/usr/local/etc/redis/redis.conf:delegated

  app:
    <<: *default_app
    build:
      context: ${PWD}
    command:
      - sh
      - -c
      - |
        rm -f tmp/pids/server.pid
        bundle install --path /project/vendor
        yarn install --check-files
        bin/rails s -p 3000 -b '0.0.0.0'
    depends_on:
      - db
      - redis
    environment:
      <<: *enviroments
      CHROMEDRIVER_PATH: /usr/bin/chromedriver
      DB_HOST: db
      DB_USERNAME: postgres
    ports:
      - "3000:3000"
    volumes:
      - ${PWD}/project:/project:delegated
      - gem_cache:/project/vendor:cached
      - node_modules:/project/node_modules:cached

volumes:
  gem_cache:
    external: true
    name: ruby-2.7.2-bundle
  node_modules:
    external: true
    name: nodejs-12.18.4-node_modules
```

## entrypoint.sh

```shell
#!/bin/sh
set -e
exec "$@"
```

## .env

```shell
UID=${UID}
GID=${GID}
```

## Project Setup

The database configuration is pretty standard - *project/config/database.yml*:

```yaml
default: &default
  adapter: postgresql
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: <%= ENV.fetch("DB_HOST") { 'localhost' } %>
  username: <%= ENV.fetch("DB_USERNAME") { 'postgres' } %>
  timeout: 5000

development:
  <<: *default
  database: db_development

test:
  <<: *default
  database: db_test
```

## Usage

- Start the machine (and create the machine the first time): `docker-compose up -d`
- Setup DB (the first time): `docker-compose exec app bin/rails db:reset`
- Enter in the machine: `docker-compose exec app sh`
- Stop the machine: `docker-compose down`
- Destroy the machine (and delete the VM): `docker-compose down -v --rmi local`

## Conclusion

I like having shared volumes for dependencies because setting up new projects is faster, but also using Dockerfile cache layers is a nice option.

If you are curious, take a look also to this post about setting up a [Vagrant Rails 6 dev environment](/2021-01-05-vagrant-rails-6-dev-environment/).

Feel free to leave me a comment to improve this post.
