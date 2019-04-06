/**
 * @overview environment configuration
 */

const nconf = require('nconf')
const path = require('path')

const config = nconf
  .argv({ parseValues: true })
  .env({ parseValues: true })
  .file(path.resolve(__dirname, 'environment.json'))

/** required environment variables */
config.required([
  'JWT_SECRET',
  'PGDATABASE'
])

module.exports = config
