---
title: 'Ruby: improving the test factories'
tags: project ruby
image: /assets/img/img-ruby.jpg
share-img: /assets/img/img-ruby_md.jpg
thumbnail-img: /assets/img/img-ruby_sm.jpg
excerpt: 'Improving the FactoryBot factories: linting, checking record counts, monitoring extra records on factory creation'
---

Sometimes the number of factories of a project grows fast and keeping them tidy can be tricky.
Old versions, outdated factories, and inefficient ones can slow down the CI quite a lot.
Here are some notes that I took to keep them in a good shape.

I'm using RSpec with FactoryBot, but some strategies can be applied to other frameworks.

## Linting factories

FactoryBot proposes a [rake take](https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md#linting-factories) in the documentation to lint their factory which invokes the method `FactoryBot.lint`.

Basically, it checks if the stubbed objects created (or built) by the factories are valid.
It can be a good strategy to prepare a spec that applies this check periodically (like once per release or more often if you prefer), for example:

```rb
# spec/lib/factories_spec.rb
FACTORIES_TO_IGNORE = [:invalid_author, :invalid_post].freeze

RSpec.describe 'Factories collection', order: :defined do
  let(:factories) do
    factories = FactoryBot.factories
    if FACTORIES_TO_IGNORE.any?
      factories = factories.reject do |factory|
        factory.name =~ /#{FACTORIES_TO_IGNORE.join('|')}/
      end
    end
    factories
  end

  it 'builds valid entities' do
    linting = FactoryBot.lint(factories, traits: true, strategy: :build)

    expect(linting).to be_nil
  end

  it 'creates valid entities' do
    linting = FactoryBot.lint(factories, traits: true, strategy: :create)

    expect(linting).to be_nil
  end
end
```

In the code above, we have 2 nested factories that produce invalid entities so we skip them from linting.

## Checking record counts

When you have a complex hierarchy of factories, another type of check that can be pretty useful regards the number of records that get created by a factory. It is useful to prevent the creation of unexpected unused objects in the application.

```rb
# spec/lib/factories_spec.rb
# ...
  it 'creates only the expected records with the post factory' do
    expect { create(:post) }.to(
      change(Post, :count).from(0).to(1).and(
        change(Author, :count).from(0).to(1).and(
          change(Profile, :count).from(0).to(1)
        )
      )
    )
  end
# ...
```

However, this check doesn't permit monitoring the creation of other entities in the database.
An alternative approach is to add a helper method to count all the records for each table, here is an example using Postgres:

```rb
# spec/support/database_helpers.rb
RSpec.shared_context 'database helpers' do
  def count_all_records
    special_tables = %w[ar_internal_metadata schema_migrations]
    results = {}
    ActiveRecord::Base.connection.execute('SELECT * FROM information_schema.tables').to_a.each do |result|
      table = result['table_name']
      next if result['table_schema'] != 'public' || result['table_type'] !~ /table/i || special_tables.include?(table)

      cnt = ActiveRecord::Base.connection.execute("SELECT COUNT(*) FROM #{table}").first['count']
      results[table] = cnt if cnt.positive?
    end
    results.sort_by { |_k, v| v }.to_h
  end
end
```

Then the previous spec can be improved with:

```rb
# spec/lib/factories_spec.rb
# ...
  it 'creates only the expected records with the post factory' do
    expected_records = { 'posts' => 1, 'authors' => 1, 'profiles' => 1 }
    expect { create(:post) }.to(
      change { count_all_records }.from({}).to(expected_records)
    )
  end
# ...
```

## Searching for unexpected DB records created on build

Sometimes you could have factories that create records also when using `build` or `build_stubbed`.
Perhaps due to inexperience with factory associations or due to outdated code.

A trivial check could be: `grep create spec/factories/*`

To validate all the available factories and traits you can setup a spec like this:

```rb
# spec/lib/factories_spec.rb
# ...
  context "with the list of file's factories", order: :defined do
    FactoryBot.factories.each do |factory|
      it "doesn't create DB records when building a #{factory.name}" do
        expect { build(factory.name) }.not_to(change { count_all_records })

        traits = factory.defined_traits.map(&:name)
        traits.each do |trait|
          expect { build(factory.name, trait) }.not_to(change { count_all_records })
        end
      end
    end
  end
# ...
```

Another approach to track down the extra entities created during the execution of the test suite can be achieved by adding some tracking code in the rails_helper:

```rb
  if ENV['OPT_TRACE_COMMITS']
    ApplicationRecord.class_eval do
      after_commit do
        Rails.logger.debug { "> after_commit: #{self.class} # id: #{id} - #{respond_to?(:name) ? name : ''}" }
        backtrace = caller.select { |line| line.include? '_spec.rb' }
        backtrace.last(3).each do |trace|
          Rails.logger.debug { "  .. #{trace}" }
        end
      end
    end
  end
```

## Additional checks

If you follow the convention that a factory filename has the plural form and it contains a factory with the matching singular form, it can be useful to search for factories with invalid filenames:

```rb
# spec/lib/factories_spec.rb
# ...
  FACTORIES = begin
    factories = Rails.root.join('spec/factories').glob('*.rb').map(&:basename).map(&:to_s).sort
    factories.map do |factory_file|
      factory_file.gsub(/\.rb\Z/, '')
    end
  end.freeze

  FACTORIES.each do |factory_file|
    it "finds a matching factory for #{factory_file} file" do
      factory = factory_file.singularize
      expect(FactoryBot.factories.registered?(factory)).to be_truthy
    end
  end
# ...
```

Feel free to leave me a comment to improve this post.
