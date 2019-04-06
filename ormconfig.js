const config = require('./config')

module.exports = {
  type: 'postgres',
  url: config.get('DATABASE_URL'),
  host: config.get('PGHOST'),
  port: config.get('PGPORT'),
  database: config.get('PGDATABASE'),
  username: config.get('PGUSER'),
  password: config.get('PGPASSWORD'),
  ssl: true,
  // output dir after compilation
  entities: ['dist/app/**/*.entity.js'],
  // output dir after compilation
  migrations: ['dist/migrations/*.js'],
  cli: {
    // where migrations get created from the cli
    migrationsDir: 'migrations'
  }
}
