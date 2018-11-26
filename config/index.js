/**
 * @overview environment configuration
 */

const nconf = require('nconf')
const path = require('path')

const config = nconf
  .argv()
  .env()
  .file(path.resolve(__dirname, 'environment.json'))

/** required environment variables */
const requiredEnvVars = [
  'JWT_SECRET',
  'PGHOST',
  'PGPORT',
  'PGUSER',
  'PGPASSWORD',
  'PGDATABASE'
]

config.required(requiredEnvVars)

module.exports = config
