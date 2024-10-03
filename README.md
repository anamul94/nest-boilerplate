<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS Starter Template with Postgres DB</h1>

<p align="center">
  A feature-rich NestJS starter template with PostgreSQL integration, authentication, and more.
</p>

<p align="center">
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456" alt="CircleCI" />
  </a>
  <a href="https://opencollective.com/nest#backer" target="_blank">
    <img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" />
  </a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank">
    <img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" />
  </a>
</p>

## 📋 Description

This repository is a [Nest](https://github.com/nestjs/nest) framework TypeScript starter template with enhanced features and integrations.

## ✨ Features

- 👤 User Management
  - SignUp (with optional Role)
  - SignIn
  - User Update
- 🔐 Authentication & Authorization
  - JWT Authentication
  - Role-based Access Control
  - Google OAuth
  - Facebook OAuth
- 🔑 Password Management
  - Reset Password
  - Forgot Password
- 📨 Email Integration
  - [MailerSend](https://www.mailersend.com/) for email services
- 📚 API Documentation
  - Swagger UI
- 🔄 Data Handling
  - Pagination
  - Automatic User Metadata Injection
- 🛠 Developer Tools
  - Docker Compose integration
  - Database Migrations

## 🚀 Installation

```bash
$ npm install
```

## 🏃‍♂️ Running the app

First, create roles in the database manually. Then:

```bash
# Prepare .env
$ cp .env-example .env
# Set values according to your config

# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## 🗄️ Database Migrations

```bash
# Generate migration
$ npm run migration:generate db/migrations/<name_of_migration>

# Run migration
$ npm run migration:run

# Revert migration
$ npm run migration:revert
```

## 🐳 Docker Compose Commands

We've included several make commands to simplify Docker Compose operations:

```bash
# Build Docker images
$ make build

# Start the application and related services in detached mode
$ make start

# Stop the application and related services
$ make stop

# View logs of all services
$ make logs
```

## 📚 API Documentation

Access Swagger UI at:

```
http://<your-domain>:<port>/api
```

Example: `http://localhost:8080/api`

## 👤 Author

- Anamul Haque
  - LinkedIn: [anamulhaque](https://www.linkedin.com/in/md-anamul-haque94/)
  - Email: [anamulhaque94@gmail.com](mailto:anamulhaque94@gmail.com)

## 🤝 Stay in touch

- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## 📄 License

This project is [MIT licensed](LICENSE).
