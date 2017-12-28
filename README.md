# minimalist-api

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/2395cb614da97594b9b6)

A REST api for managing tasks and lists.

## Requirements

- Node >= 8.8
- npm >= 5.5
- Postgresql 9.x

It's recommended that you use [`nvm`](https://github.com/creationix/nvm) to manage Node versions

## Getting Started

### Dependencies

Once you've got Node/npm installed you can run `npm install` to install app dependencies. It is recommended you do this prior to getting the database configured if you want to make use of the `npm run migrate` command.

### Running locally via Docker

This project uses Docker for local development, and the Dockerfile can also be used for production. `docker-compose` provides a clean interface for doing local development and overriding production defaults.

#### Requirements to run via Docker
- `Docker` should be installed, supporting `docker-compose` v3.1
- Have postgres configured in `environment.json`. If you don't want to locally install postgres but would rather connect to a remote instance you will need to change the `PGHOST` environment variable specified in `docker-compose`

#### Build and run the app

Once you've got Docker installed and postgres installed (or a remote instance), you can build and run the app. You can use one simple command to do the whole thing:

- `docker-compose up`

Of course, you can also manually build the `Dockerfile` with your own flags, but `docker-compose` make running the app quite simple.

### Database and migrations

Before starting the app, setup a local database or configure a remote database. If you have Postgres installed locally you can configure your `config/environment.json` with the appropriate environment variables (see `config/environment.example.json` for reference). You can create a database and install the `pgcrypto` extension (required for `uuid` types) – running `psql -f setup-db.sql` will do this work for you.

Migrations are implemented via `db-migrate` – if you want to have full control via the cli you can install it globally: `npm install -g db-migrate` which will make `db-migrate *` CLI commands available. If you simply want to run all migrations you can execute: `npm run migrate`.

### NPM commands

- `npm install` to install dependencies
- `npm lint` to check (and fix many) syntax/formatting
- `npm run migrate` to run all `up` migrations. This is equivalent to running `db-migrate up`
- `npm start` to run the server

## TODO

- [x] Associate tasks for a list (`list_id` foreign key)
- [x] Make readme
- [x] Validate input params for route handlers
- [x] Simple search mechanics for the tasks all method
- [x] Add (simple) versioning support
- [x] "Run in Postman" button in README
- [ ] Add tests
- [ ] Add task sort ordering
- [ ] Support `PATCH` partial updates for tasks and lists
- [x] Dockerize? Deal with Postgres persistence (decided against PG in a mounted volume – aka dont use containers for PG)
- [ ] Consider authN and authZ implementations
- [ ] Consider sharing
- [ ] Rate limiting
