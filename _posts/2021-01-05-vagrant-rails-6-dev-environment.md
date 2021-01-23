---
title: 'Vagrant Rails 6 dev environment setup'
tags: ruby rails
image: /assets/img/img-ruby-on-rails.png
share-img: /assets/img/img-ruby-on-rails_md.png
thumbnail-img: /assets/img/img-ruby-on-rails_sm.png
excerpt: Setup a Ruby on Rails development environment using Vagrant
---

Recently I made some experiments to setup a Rails 6 dev environment using Vagrant.<br/>
I started from [rails/rails-dev-box](https://github.com/rails/rails-dev-box) and applied some changes.

## VM Setup

These are the features of the Vagrant file that I'm using:
- Ubuntu 18.04 LTS box;
- ability to install different ruby versions;
- project files (placed in **./project**) kept in sync using *rsync*.

*Vagrantfile* (which I keep in **./_vagrant** directory):

```ruby
Vagrant.configure('2') do |config|
  config.vm.box      = 'ubuntu/bionic64' # 18.04 LTS
  config.vm.hostname = 'my-project'
  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.provider 'virtualbox' do |vb|
    # vb.check_guest_additions = false
    vb.gui    = true
    vb.memory = ENV.fetch('RAILS_DEV_BOX_RAM', 4096).to_i
    vb.name   = 'my-project'
    vb.cpus   = ENV.fetch('RAILS_DEV_BOX_CPUS', 2).to_i
  end
  config.vm.provision 'shell' do |sh|
    sh.env        = { 'RUBY_VERSION' => '2.7.2', 'SWAP_SIZE' => '2G' }
    sh.keep_color = true
    sh.path       = 'bootstrap.sh'
    sh.privileged = false
  end
  config.vm.synced_folder './project', '/project', type: 'rsync', rsync__exclude: ['.git/']
end
```

## Dev Environment Setup:

Main features:
- RVM setup + Ruby install;
- chromedriver to run feature specs;
- install NodeJS (14.x) using nodesource.com;

*bootstrap.sh*:

```shell
#!/usr/bin/env bash

# Suppress command output and exit on error
function check_result {
  echo "--- $1 ---"
  shift
  $@ > /dev/null
  result=$?
  test $result -eq 0 || \
    { echo "!!! error: $result"; exit $result; }
}

# Suppress installation steps output
function apt_install {
  echo "--- Installing $1 ---"
  shift
  sudo apt -y install "$@" >/dev/null 2>&1
}

echo '~~~ Bootstrap script ~~~'

echo '--- Adding swap file ---'
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap defaults 0 0' | sudo tee -a /etc/fstab

# Prevents "Warning: apt-key output should not be parsed (stdout is not a terminal)".
export APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo -E apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

check_result 'Updating package information' sudo apt-get -y update

apt_install 'development tools' build-essential autoconf libtool

echo '--- Setup RVM ---'
echo silent >> ~/.curlrc
check_result 'Add RVM key' gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | check_result 'Installing RVM' bash -s stable

source $HOME/.rvm/scripts/rvm
check_result "Installing Ruby $RUBY_VERSION" rvm install $RUBY_VERSION

check_result 'Update Ruby gems' gem update --system -N
check_result 'Installing Bundler' gem install bundler -N

apt_install Git git
apt_install SQLite sqlite3 libsqlite3-dev
apt_install Redis redis-server
apt_install 'Nokogiri dependencies' libxml2 libxml2-dev libxslt1-dev
apt_install 'chromedriver' chromium-driver

# PostgreSQL setup
apt_install PostgreSQL postgresql postgresql-contrib libpq-dev
sudo -u postgres createuser --superuser vagrant
cat > /tmp/pg.conf <<- EOF
local   all             postgres                                trust
local   all             all                                     trust
local   replication     all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust
EOF
sudo cp /tmp/pg.conf /etc/postgresql/10/main/pg_hba.conf
sudo systemctl restart postgresql

# NodeJS setup
curl -sL https://deb.nodesource.com/setup_14.x | check_result 'Update NodeJS sources' sudo bash -
apt_install 'NodeJS' nodejs yarn

# Setup locales
sudo update-locale LANG=en_US.UTF-8 LANGUAGE=en_US.UTF-8 LC_ALL=en_US.UTF-8

# Shell utils
cat >> $HOME/.bashrc <<- EOF
alias be="bundle exec"
export DB_HOST="localhost"
export REDIS_URL="redis://localhost:6379/0"
export CHROMEDRIVER_PATH="`which chromedriver`"
cd /project
EOF

echo '--- Project setup ---'
source $HOME/.bashrc
cd /project
check_result 'bundle install' bundle install
check_result 'yarn install' yarn install --check-files
check_result 'rails db:reset' bin/rails db:reset

echo '~~~ Ready! ~~~'
```

### Customizations

To setup MySQL in place of PostgreSQL:

```shell
debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
install MySQL mysql-server libmysqlclient-dev libssl-dev
# Set the password in an environment variable to avoid the warning issued if set with `-p`.
MYSQL_PWD=root mysql -uroot <<SQL
CREATE USER 'rails'@'localhost';
SQL
```

To install ASDF in place of RVM:

```shell
git clone https://github.com/asdf-vm/asdf.git $HOME/.asdf --branch v0.8.0
. $HOME/.asdf/asdf.sh
asdf plugin-add ruby https://github.com/asdf-vm/asdf-ruby.git
asdf install ruby 2.7.2
```

## Project Setup

The database configuration is pretty standard - *project/config/database.yml*:

```yaml
default: &default
  adapter: postgresql
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

development:
  <<: *default
  database: db_development

test:
  <<: *default
  database: db_test
```

Selenium configuration for RSpec (for feature and system specs) - *project/spec/support/selenium.rb*:

```ruby
Capybara.register_driver :selenium_chrome_headless do |app|
  Selenium::WebDriver::Chrome::Service.driver_path = ENV['CHROMEDRIVER_PATH'] if ENV['CHROMEDRIVER_PATH']
  capabilities = ::Selenium::WebDriver::Remote::Capabilities.chrome(
    'goog:chromeOptions' => {
      'args': %w[disable-dev-shm-usage disable-gpu headless no-sandbox window-size=1600,1000]
    }
  )
  options = {
    browser: :chrome,
    desired_capabilities: capabilities,
  }
  Capybara::Selenium::Driver.new(app, options)
end

RSpec.configure do |config|
  config.before(:each, type: :feature, js: true) do |_spec|
    Capybara.current_driver = :selenium_chrome_headless
    Capybara.javascript_driver = :selenium_chrome_headless
  end

  config.before(:each, type: :system) do
    driven_by(:selenium_chrome_headless)
  end
end
```

## Usage

- Start the machine (and create the machine the first time): `vagrant up`
- Enter in the machine: `vagrant ssh`
- Start the server (then point the browser to **localhost:3000**): `bin/rails s -b 0.0.0.0`
- Watch for changes (in another shell): `vagrant rsync-auto`
- Stop the machine: `vagrant halt`
- Destroy the machine (and delete the VM): `vagrant destroy`

## Conclusion

Preparing a good dev enviroment takes some time to tune the right options but when it's ready it is pretty comfortable also when you need to share the machine configuration with other developers.

Feel free to leave me a comment to improve this post.
