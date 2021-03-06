# minimalist-api

An api for managing tasks and lists of tasks.

[![CircleCI](https://circleci.com/gh/mshwery/minimalist-api/tree/main.svg?style=svg)](https://circleci.com/gh/mshwery/minimalist-api/tree/main)

## Requirements

- Node >= 14
- Yarn >= 1.15
- Postgresql 11.6

## Getting Started

### Dependencies

Once you've got Node/yarn installed you can run `yarn install` to install app dependencies. It is recommended you do this prior to getting the database configured if you want to make use of the `yarn migrate` command.

### Running locally via Docker

This project uses Docker for local development, and the Dockerfile can also be used for production. `docker-compose` provides a clean interface for doing local development and overriding production defaults.

#### Requirements to run via Docker

- `Docker` must be installed
- Have postgres configured in `environment.json`. If you don't want to locally install postgres but would rather connect to a remote instance you will need to change the `PGHOST` environment variable specified in `docker-compose`

#### Build and run the app

```shell
docker-compose up -d
yarn start
```

### Database and migrations

Typeorm is our ORM / query builder for connecting to a Postgres database.

Migrations can be generated using Typeorm `yarn server typeorm migration:generate -n NameOfMigration`.

To run migrations: `yarn migrate` or `yarn migrate:dev` (also runs the build, which is where typeorm's cli is looking for new migrations).

Because the tests rely on actually interacting with a database, we have a separate test db where we run migrations automatically run during test setup in order to drop the schema and start with a fresh database for every test run. You may need to take special consideration for cleaning up any data you create in a test suite, directly so not to impact other tests that may break due to cross contamination. (`TODO: consider safely resetting the entire db with every test`)

### Yarn commands

- `yarn install` to install dependencies
<!-- - `yarn lint` to check (and fix many) syntax/formatting -->
- `yarn server migrate` to run all `up` migrations. This is equivalent to running `npx typeorm migration:run`
- `yarn build` to compile the build
- `yarn test` to run lint checks and tests
- `yarn dev` to run the server in watch mode
- `yarn start` to run the production server

### Heroku

The entire app (server and create-react-app web client) is served on Heroku. Deploys happen automatically after successful Circle CI builds to `main`.

To run migrations: `heroku run 'yarn install --frozen-lockfile --production=false && yarn migrate' -a getminimalist2`

TBD how to deal with automatic migrations before code runs. For now we'll just safely migrate databases in a way that won't break code.
