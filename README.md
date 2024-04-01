<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# <p align="center">NestJs starter template with Postgres DB</p>

</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Feature

<ul style="list-style-type:disc">
<li>User SignUp(Role:Optional) </li>
<li>User SignIn</li>
<li>User Update</li>
<li>JWT</li>
<li>Set role to bulk user(Admin Only)</li>
<li>Swagger </li>

</ul>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# Prepare .env
$ cp .env-example .env
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

## DB migration

```bash
# generate
$ npm run migration:generate db/migrations/<name_of_migration>

#run
$ npm run migration:run

#revert

$ npm run migration:revert

```

## Swagger URL

{ip/domain}:{port}/api

# Example

http://localhost:8080/api

## Stay in touch

- Author - [Anamul Haque]
- LinkedIn - [](www.linkedin.com/in/md-anamul-haque94)
