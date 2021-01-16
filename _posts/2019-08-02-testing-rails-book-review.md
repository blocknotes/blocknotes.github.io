---
title: 'Rails testing tips for newcomers'
image: /assets/img/img-rspec.png
tags: ruby rails testing
excerpt: Writing effective tests is tricky. A good book that can be helpful is Testing Rails by Thoughtbot
canonical: 'https://nebulab.it/blog/testing-rails-book-review/'
---

_Writing effective tests is tricky._ When working with Ruby on Rails, a good starting 
book about this matter is 
["Testing Rails"](https://github.com/thoughtbot/testing-rails), published by 
[Thoughtbot](https://thoughtbot.com/). In this article, I will offer some 
interesting points that I found in it.

## Main concepts highlighted by the book

What are the characteristics of an effective test suite?

- _Fast_: the faster your tests are, the more often you can run them (ideally 
after every change);
- _Complete_: tests cover all public code paths in your application;
- _Reliable_: tests do not wrongly fail or pass;
- _Isolated_: tests set themselves up (so that you can run tests 
individually), and clean up after themselves (to avoid to leave data or 
global state which can lead to failures in other tests);
- _Maintainable_: if it is difficult to add new tests, you will stop writing 
them and your suite becomes ineffective;
- _Expressive_: tests should be easy enough to read so they can serve as 
documentation (because they are always kept up to date). This is related to 
the concept of **Living documentation**.

### TDD (Test Driven Development)

Test Driven Development is an approach to create applications where you write 
tests first, you write just enough production code to fulfill that tests and 
you refactor the code to improve it; repeating these 3 steps until you reach a 
good level of completness of the software.

_TDD_ is based on a process called Red, Green, Refactor:

- _Red_: write a test that covers the functionality you would like to see 
implemented, run the test, you should see it fail;
- _Green_: read the error message from the failing test, and write as little 
code as possible to fix the current error message;
- _Refactor_: clean up your code, reducing any duplication you may have 
introduced; this includes your code as well as your tests.

TDD Approaches:

- _Outside-In Development_ starts from the highest level of abstraction first. 
Often, this will be from the perspective of the user who accesses the 
application using a browser and interacting with a set of pages. This kind of 
tests are called **acceptance tests** and are focused on the behavior of the 
program. During the development of the application more internal details are 
written and more low-level tests can be prepared.
- Sometimes you don't know what will be your end solution, and it could be 
better an _Inside-Out Development_ approach which helps you build up your code 
component by component. At each step, you create a larger piece of the 
application until a complete state is reached.

## Tests in Rails

Testing is a big topic, there are plenty of features to check and different 
ways to do it. That's why some good components are required to prepare valid 
tests. In the following section, you can find the main ones.

### [rspec-rails](https://github.com/rspec/rspec-rails)

**In brief**: provides the structure for writing executable examples of how 
your code should behave.

**Installation**: add `gem 'rspec-rails'` to the Gemfile, in groups 
_development_ (because it adds Rails generators and rake tasks) and _test_.
After executing `bundle`, launch: `rails generate rspec:install` which 
generates **spec/spec_helper.rb** (used to customize how RSpec behaves), 
**spec/rails_helper.rb** (used to customize how RSpec behaves in the Rails 
application), **.rspec** (used to specify RSpec flags)

**Notes**: some good flags for **.rspec** (require spec_helper, enable colors, 
expanded output format, list slowest examples):

```
--require spec_helper
--color
--format documentation
--profile
```

### [capybara](https://github.com/teamcapybara/capybara)

**In brief**: it helps you test web applications by simulating how a real user 
would interact with your app. In other words, it is an acceptance test 
framework for Ruby web applications.

**Installation**: add `gem 'capybara'` to the Gemfile (in _test_ group). After 
executing `bundle`, add `require 'capybara/rails'` to **spec/rails_helper.rb**

**Notes**: main methods available: `fill_in`, `find`, `have_content`, 
`has_css`, `have_link`, `within`, `visit`. An important note about `find` is 
that it will keep trying until the element shows up on the page or a maximum 
wait time has been exceeded (default 2 seconds)

<h3><a href="https://github.com/thoughtbot/factory_bot_rails" target="blank">factory_bot_rails</a></h3>

**In brief**: library for setting up Ruby objects as test data.

**Installation**: add `gem 'factory_bot_rails'` to the Gemfile (in _test_ group) 
and execute `bundle`

**Notes**: main methods available: `attributes_for`, `build`, `build_stubbed`, 
`create`

### [database_cleaner](https://github.com/DatabaseCleaner/database_cleaner)

**In brief**: strategies for cleaning databases in Ruby. It helps to run 
_isolated_ examples.

**Installation**: add `gem 'database_cleaner'` to the Gemfile (in _test_ group) 
and execute `bundle`

**Configuration**: add to **spec/rails_helper.rb** (basic example):

```
config.before(:suite) do
  DatabaseCleaner.strategy = :transaction
  DatabaseCleaner.clean_with(:truncation)
end

config.around do |example|
  DatabaseCleaner.cleaning do
    example.run
  end
end
```

Read the gem documentation to see other configuration options.

### [shoulda-matchers](https://github.com/thoughtbot/shoulda-matchers)

**In brief**: simple one-liner tests for common Rails functionality that, if 
written by hand, would be much longer, more complex, and error-prone.

**Installation**: add `gem 'shoulda-matchers'` and 
`gem 'rails-controller-testing'` to the Gemfile (in test group) and execute 
`bundle`. Add to **spec/rails_helper.rb**:

```
Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end
```

**Example**: to check a presence validation: 
`it { should validate_presence_of(:name) }`

### Other gems

More gems described in the book:

- [_email-spec_](https://github.com/email-spec/email-spec): helpful matchers 
for testing mailers, for example: `deliver_to`, `deliver_from`, 
`have_subject`, `have_body_text`
- [_vcr_](https://github.com/vcr/vcr): allows to record HTTP requests and 
replay them in future test runs
- [_webmock_](https://github.com/bblimke/webmock): allows to intercept HTTP 
requests and returns a canned response (can be configured to block all 
external web requests raising an exception)

Some other gem that could help a lot:

- [_capybara-screenshot_](https://github.com/mattheworiordan/capybara-screenshot): 
automatically save screen shots when a Capybara scenario fails
- [_faker_](https://github.com/stympy/faker): a library for generating fake 
data such as names, addresses, and phone numbers
- [_simplecov_](https://github.com/colszowka/simplecov): code coverage with a 
powerful configuration library and automatic merging of coverage across test 
suites
- [_rspec-retry_](https://github.com/NoRedInk/rspec-retry): retry randomly 
failing rspec example
- [_rubocop-rspec_](https://github.com/rubocop-hq/rubocop-rspec): code style 
checking for RSpec files (_Rubocop_ extension)
- [_webdrivers_](https://github.com/titusfortner/webdrivers): keep your 
Selenium WebDrivers updated automatically

## Random tips and suggestions

- You should test _what_ your code does, not _how_ it is done. So it's 
important to favor testing behavior over implementation.
- Private methods are an implementation detail and should not be tested.
- Avoid testing code you don't own, like third-party libraries (they should 
already be tested by the respective authors).
- Where possible, prefer `.build_stubbed` (instantiates an object, 
instantiates the associated objects) (or `.build` - instantiates an object, 
create the associated objects on DB) over `.create` (create an object and the 
associated objects on DB), as persisting to the database is one of the 
slowest operations in many tests.
- Feature tests which use a JavaScript driver (enabled with `js: true`) are 
very slow, if JS is not required you can disable it on some specific examples.
- [travel_to](https://api.rubyonrails.org/classes/ActiveSupport/Testing/TimeHelpers.html#method-i-travel_to) 
(Rails 4.1+) method allows you to stub the time within a block without extra 
gems (like [_timecop_](https://github.com/travisjeffery/timecop)).
- Ideally, in a pure unit test, we could isolate the SUT (_System Under Test_) 
from its collaborators so that only the SUT would cause our spec to fail.
- _factories_ should define the minimum number of attributes for the model to 
pass validations, use _traits_ to extend them.
- When _mocking_ an interaction with a collaborator we set up an expectation 
that it will receive a given message and then exercise the system to see if 
that does indeed happen.
- _Spying_ allows us to check if an object (which must be stubbed) receives a 
given message.
- _Stubbing_ allows us to tell collaborators to return a canned response when 
they receive a given message.
- When you don't need Rails, or any of its dependencies, require your 
spec_helper instead of rails_helper for modest time savings.
- Write happy path tests with feature specs, and sad paths with some other 
medium, such as _request specs_ or view specs.
- Whenever you modify global state, be sure to reset it to the original state 
after the test is run, _even if the test raises an error_.
- It’s generally a best practice to encapsulate external interactions (ex. 
API service) in an adapter class. Your tests can stub this adapter instead of 
making the network request.
- The _extract method_ and _page object_ patterns are commonly used to hide 
implementation details and to maintain a single level of abstraction in both 
source code and specs.

## Conclusion

There are plenty of ways to write tests, but preparing good ones sometimes can 
be difficult. With the right experience and some useful tools, this goal can 
be achieved and writing specs suddenly becomes fun because keeping the test 
suite tidy can let you learn different perspectives on your code and over the 
years the Rails community built a nice set of comfortable tools that helps a 
lot.

I would be really interested in knowing what gems you like. 
Please leave a comment if you can suggest any other testing gem.
