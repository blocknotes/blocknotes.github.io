---
title: 'First steps with Opal 1.0'
tags: project ruby
image: /assets/img/img-ruby.jpg
share-img: /assets/img/img-ruby_md.jpg
thumbnail-img: /assets/img/img-ruby_sm.jpg
---

Recently I have spent some time doing experiments with [Opal rb](https://github.com/opal/opal#readme) 1.0, to use Ruby in place of Javascript.\
Here are some tests that could be useful.

### Require other sources

There are 3 methods to include other sources: `require`, `require_relative` and `require_tree`. Also `autoload` can be used to include.\
Let's see an example with `require`:

```rb
# foo.rb
puts 'foo'
```

```rb
# bar.rb
require './foo.rb'
puts 'bar'
```

Run it with: `opal bar.rb`\
And the output is:

```
foo
bar
```

### Using a NodeJS component

Here are some points to use a JS library in an Opal project, for example [colors](https://www.npmjs.com/package/colors).\
To create a new project and add the library:

```sh
yarn init
# Enter the required fields
yarn add colors
```

Require a module, assign the reference and call a method:

```rb
require 'native'
Colors = Native(`require('colors/safe')`)
puts Colors.green('bar')
```

Execute a JS method on a Ruby string:

```rb
`require('colors')`
puts 'foo'.JS[:red]
```

Compile and run the code:

```sh
opal -c app.rb > app.js
node app.js
```

### JS export

Export variables:

```rb
`exports.test1 = 'A string'`
# or
`exports`.JS[:test1] = 'Another string'
# or
Native(`exports`).test1 = 'Last string'
```

To access to the exported variable in another file:

```rb
puts `exports.test1`
# or
puts `exports`.JS[:test1]
# or
puts Native(`exports`).test1
```

Export methods:

```rb
`exports`.JS[:test1] = `function() { console.log("A method") }`
# or
`exports`.JS[:test1] = -> { puts 'Another method' }
```

To access to the exported method in another file:

```rb
`exports.test1()`
# or
`exports`.JS.test1
# or
Native(`exports`).test1
```
<br/>

Feel free to leave me a comment to improve this post.
