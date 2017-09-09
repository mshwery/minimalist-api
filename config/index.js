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
const requiredEnvVars = []

/** required environment variables for production */
if (config.get('NODE_ENV') === 'production') {
  // @todo configure
  // requiredEnvVars.push()
}

config.required(requiredEnvVars)

module.exports = config
