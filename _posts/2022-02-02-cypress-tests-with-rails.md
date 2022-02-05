---
title: 'Cypress tests with Rails'
tags: project javascript
image: /assets/img/img-js.jpg
share-img: /assets/img/img-js_md.jpg
thumbnail-img: /assets/img/img-js_sm.jpg
excerpt: 'E2E Cypress tests with a Rails server and a web client'
---

In this blog post, I propose a sample project to set up end-to-end tests with the following form:
- an Alpine.js client to fetch data from the server;
- a Rails server to provide an API;
- a Cypress project to host the E2E tests.

The main features are:
- data tests setup using server entities;
- make real requests to the server (without stubbing/mocking);
- run some server checks in the E2E tests;
- automatically trigger the Cypress tests when a change is applied in the client or in the server projects.

There are 2 solutions proposed:
- using git submodules to link the server and client projects in the E2E repository;
- using Docker images to run the server and client apps.

## A sample client

Alpine.js client app that fetches data from the server (but the stack is not relevant, it could be React / Vue.js / Angular.js / etc.): [test_alpinejs](https://github.com/blocknotes/test_alpinejs) project.

It includes a simple _Dockerfile_ for the tests solution that uses Docker images and a _build_ GitHub Action workflow that sends the generated image to Docker Hub when a change is applied.

At the end of the Action, there's a step that triggers the workflow of another repository - the tests in the Cypress project.

## A sample server

Ruby on Rails 7 server app that provides a simple API to list Messages and to create a new Message: [test_rails7](https://github.com/blocknotes/test_rails7) project.

As for the client project, there's a _Dockerfile_ and a _build_ GitHub Action workflow to upload the Docker image to Docker Hub.

The server project includes a gem used as a bridge ([cypress-on-rails](https://github.com/shakacode/cypress-on-rails)) to execute server code from the Cypress tests.

## A project for end-to-end tests

Cypress tests: [test_cypress](https://github.com/blocknotes/test_cypress) project, with some useful examples.

There's an example that invokes the creation of server entities using FactoryBot's factories. In Cypress it will be:

```js
// Calling FactoryBot create and create_list
cy.appFactories([
  ['create', 'message', { author: 'Mat', content: 'Just a message' }],
  ['create_list', 'message', 3]
])
```

There's an example that generates server entities using Rails fixtures.

```js
// Calling a Rails fixture
cy.appFixtures({ fixtures: ['posts'] })
```

There's an example that prepares the test data using a scenario (a script that sets up the necessary data).

```js
// Calling a scenario
cy.appScenario('basic')
```

There's an example that executes some server-side checks (ex. count the number of database records).

```js
// Calling custom commands for a server side check
cy.appCountRecords('Message').then((result) => {
  expect(result).to.eq(0)
})
```

The [first version](https://github.com/blocknotes/test_cypress/tree/no_docker) uses 2 git submodules to link the client and server projects to the E2E repository. In this case, there's a GitHub Action that sets up the apps to test and then runs the Cypress tests.

The [second version](https://github.com/blocknotes/test_cypress) uses 2 container images to start the services to test. In this case, there's a GitHub Action that pulls the 2 images from Docker Hub and runs the Cypress tests.
Another option to Docker Hub could be the GitHub Container Registry, using the same auth and ACL of the GitHub projects.

On tests failures, the screenshots are stored as artifacts - optionally there's also the video recording.

## Conclusion

Cypress is a powerful solution for E2E and smoke tests, combining it in a GitHub Action is pretty useful.
Using a separated repository is nice, but a drawback could be that the tests are separated from the client project code.
_cypress-on-rails_ gem is really good: it adds a middleware that handles special requests used for the commands sent to the server from Cypress - this means that it's not suitable for production or you'll need to take special care of security issues.
