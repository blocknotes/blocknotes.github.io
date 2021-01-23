---
title: 'Reverse Coverage: Find which tests execute which lines of code'
tags: project rspec ruby testing
image: /assets/img/img-rspec.png
share-img: /assets/img/img-rspec_md.png
thumbnail-img: /assets/img/img-rspec_sm.png
excerpt: Reverse Coverage allows you to find out which tests execute which lines of code
canonical: 'https://nebulab.it/blog/reverse-coverage/'
---

Have you ever wondered what tests _cover_ a specific part of a project?

Occasionally it could be useful to discover how is tested/executed/documented 
(in the way of tests as _Living Documentation_) a line (or set of lines) of an 
application.

For example, when you create a part that stands over a product (like a Rails 
Engine), you override methods, alter classes at runtime, add new behaviors that 
could bring regressions to the underlying system. So **it can help to check 
what/how specs treat the original lines of code**.

Our component, **Reverse Coverage**, has this goal in mind.

Another case of usage is when you work on a project with a lot of slow specs, if
you need to check how your changes will affect the whole system without running 
the entire test suite you can use our tool to find only the affected specs.

Or when you need to write a test for a part that is similar to another one, 
looking for other examples could be a reference for the new ones or even 
improve the old ones if they are not meaningful.

## How it works

Internally Reverse Coverage uses the Ruby standard library [Coverage](https://ruby-doc.org/stdlib-2.5.5/libdoc/coverage/rdoc/Coverage.html)
component that provides coverage measurements for the sources file loaded in a 
project.

After each executed spec example, we evaluate the difference between the old 
coverage "state" with the current one and we insert the data in a structure 
named *coverage_matrix*; this hash stores the examples' information connected to
the source lines covered.

At the end of the specs, **we produce a YML file with the results**, the default
output path is *tmp/reverse_coverage.yml* and/or an **simple HTML GUI** to 
browse the results, a good part of this formatter is took from 
[simplecov-html](https://github.com/colszowka/simplecov-html).

Here it is a screenshot of the generated HTML interface:
![Reverse Coverage screenshot](/assets/img/screenshot-reverse-coverage.jpg)

## Output format

The keys of the output hash are the source files and values are hashes with the 
relative examples. Each one of the hashes has line numbers as keys and the 
examples data as values.

An example of the YML output produced is the following:

```yml
---
"/projects/project_sample1/app/controllers/posts_controller.rb":
  6:
  - :description: should have received all(*(any args)) 1 time
    :full_description: PostsController#index should have received all(*(any args))
      1 time
    :file_path: "./spec/controllers/posts_controller_spec.rb"
    :line_number: 14
    :scoped_id: '1:1:1'
    :type: :controller
    :example_ref: 3155364627336002659
  - :description: should render template index
    :full_description: PostsController#index should render template index
    :file_path: "./spec/controllers/posts_controller_spec.rb"
    :line_number: 15
    :scoped_id: '1:1:2'
    :type: :controller
    :example_ref: -1205417070080268895
  30:
  - &1
    :description: 'should have received new(<ActionController::Parameters {"author_id"=>"",
      "category"=>"", "created_at"=>"", "description"=>"", ..."", "state"=>"available",
      "subtitle"=>"", "title"=>"Just a post", "updated_at"=>""} permitted: true>)
      1 time'
    :full_description: 'PostsController#create should have received new(<ActionController::Parameters
      {"author_id"=>"", "category"=>"", "created_at"=>"", "description"=>"", ..."",
      "state"=>"available", "subtitle"=>"", "title"=>"Just a post", "updated_at"=>""}
      permitted: true>) 1 time'
    :file_path: "./spec/controllers/posts_controller_spec.rb"
    :line_number: 55
    :scoped_id: '1:4:1'
    :type: :controller
    :example_ref: -2140352806102114351
"/projects/project_sample1/app/models/author.rb":
  25:
  - *1
```

## Conclusion

We think that the idea can be useful to others and decided to release it as 
open-source. **It works with Ruby and Rails projects using RSpec test suite**.

- Gem page: [reverse_coverage](https://rubygems.org/gems/reverse_coverage/)
- Project page: [Reverse Coverage](https://github.com/nebulab/reverse_coverage)
- Authors: [Daniele Palombo](https://github.com/DanielePalombo) and [Mattia Roccoberton](https://github.com/blocknotes)

Feel free to leave me a comment to improve this project.
