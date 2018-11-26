# minimalist-api

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/2395cb614da97594b9b6)

An api for managing tasks and lists.

## Requirements

- Node >= 8.x
- npm >= 5.5
- Postgresql 9.x

## Getting Started

### Dependencies

Once you've got Node/npm installed you can run `npm install` to install app dependencies. It is recommended you do this prior to getting the database configured if you want to make use of the `npm run migrate` command.

### Running locally via Docker

This project uses Docker for local development, and the Dockerfile can also be used for production. `docker-compose` provides a clean interface for doing local development and overriding production defaults.

#### Requirements to run via Docker
- `Docker` should be installed, supporting `docker-compose` v3.1
- Have postgres configured in `environment.json`. If you don't want to locally install postgres but would rather connect to a remote instance you will need to change the `PGHOST` environment variable specified in `docker-compose`

#### Build and run the app

```shell
docker-compose up -d
npm start
```

### Database and migrations

Before starting the app, setup a local database or configure a remote database. If you have Postgres installed locally you can configure your `config/environment.json` with the appropriate environment variables (see `config/environment.example.json` for reference). You can create a database and install the `pgcrypto` extension (required for `uuid` types) – running `psql -f setup-db.sql` will do this work for you.

Migrations are implemented via `db-migrate` – if you want to have full control via the cli you can install it globally: `npm install -g db-migrate` which will make `db-migrate *` CLI commands available. If you simply want to run all migrations you can execute: `npm run migrate`.

### NPM commands

- `npm install` to install dependencies
- `npm lint` to check (and fix many) syntax/formatting
- `npm run migrate` to run all `up` migrations. This is equivalent to running `db-migrate up`
- `npm start` to run the server

## TODO

- [ ] Add tests
- [ ] Add task sort ordering
- [ ] Support `PATCH` partial updates for tasks and lists
- [ ] Consider authN and authZ implementations
- [ ] GraphQL impl
- [ ] TypeScript
- [ ] Typeorm
- [ ] Consider sharing
- [ ] Rate limiting
