/**
 * @overview postgres database interface
 */

const { Pool } = require('pg')
const config = require('../../config')
const { ServiceUnavailableError } = require('../utils/errors')

/**
 * Create a new connection pool to a postgres db
 */
const pool = new Pool({
  host: config.get('PGHOST'),
  port: config.get('PGPORT') || 5432,
  user: config.get('PGUSER'),
  password: config.get('PGPASSWORD'),
  database: config.get('PGDATABASE')
})

/**
 * Execute a parameterized query using the connection pool
 * @param {string} text - the sql query to execute
 * @param {Object} params - object of properties for sql parameterization
 * @returns {Promise}
 */
function query (text, params) {
  return pool.query(text, params)
    .catch(err => {
      if (err.code === 'ECONNREFUSED') {
        throw ServiceUnavailableError('Unable to connect to database.')
      } else {
        throw err
      }
    })
}

/**
 * Starts a transaction with error handling (throw to abort transaction) and async support
 * @param {Function} callback - callback function with signature of `fn(client) { return Promise.resolve() }`
 * @returns {Promise}
 *
 * @example
 *
 *   db.transaction(async (client) => {
 *     const { rows } = client.query('INSERT INTO users(name) VALUES($1) RETURNING id', ['Matt'])
 *     return client.query('INSERT INTO photos(user_id, photo_url) VALUES($1, $2)', [rows[0].id, 's3.bucket.foo'])
 *   })
 */
async function transaction (callback) {
  const client = await pool.connect()
  let results

  try {
    await client.query('BEGIN')
    results = await callback(client)
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  return results
}

/**
 * Convenience method to return only the first result of a query
 * Typically useful when querying what's expected to only return a single record anyway
 * @param {string} text - the sql query to execute
 * @param {Object} params - object of properties for sql parameterization
 * @returns {Promise}
 */
async function getOne (text, params) {
  const { rows } = await query(text, params)
  return rows[0]
}

module.exports = {
  getOne,
  query,
  transaction
}
