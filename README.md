# minimalist-api

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/2395cb614da97594b9b6)

A REST api for managing tasks and lists.

## Requirements

- Node >= 8.x
- npm >= 5.x
- Postgresql 9.x

It's recommended that you use [`nvm`](https://github.com/creationix/nvm) to manage Node versions

## Getting Started

### Dependencies

Once you've got Node/npm installed you can run `npm install` to install app dependencies. It is recommended you do this prior to getting the database configured if you want to make use of the `npm run migrate` command.

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
- [ ] Dockerize? Deal with Postgres persistence
- [ ] Consider authN and authZ implementations
- [ ] Consider sharing
- [ ] Rate limiting
