const config = require('./config')

module.exports = {
  type: 'postgres',
  url: config.get('DATABASE_URL'),
  host: config.get('PGHOST'),
  port: config.get('PGPORT'),
  database: config.get('PGDATABASE'),
  username: config.get('PGUSER'),
  password: config.get('PGPASSWORD'),
  ssl: config.get('PGSSL') ? { rejectUnauthorized: false } : false,
  synchronize: false,
  migrationsRun: false,
  migrations: config.get('NODE_ENV') === 'production' ? [] : ['migrations/*.ts'],
  cli: {
    // where migrations get created from the cli
    migrationsDir: 'migrations',
  },
}
