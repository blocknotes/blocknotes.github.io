---
title: 'Starter project: Rails Vue example'
image: /assets/img/img-vuejs.png
tags: ruby rails vue.js
excerpt: A small project to use Vue.js in a Ruby on Rails webapp
---

Good News, Everyone!

I published a small project to use [Vue.js](https://vuejs.org/) in a Ruby on Rails webapp.

GitHub project: [https://github.com/blocknotes/rails-vue-example](https://github.com/blocknotes/rails-vue-example)

Put all the Vue components in a folder (app/views/components) then every style and script will be included automatically in the Rails pipeline. In this way we can combine a template engine like Slim (for the Vue templates) and a style preprocessor like Sass (for the Vue styles).

But Slim templates are rendered when the asset pipeline is precompiled, so we need to avoid to call server side functions to fetch data; instead we can use AJAX to load data remotely for example using [vue-resource](https://github.com/vuejs/vue-resource).
