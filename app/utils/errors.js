/**
 * @overview Error helpers
 */

'use strict'

const createError = require('http-errors')

/**
 * BadRequestError constructor
 * @param {string} message - the error message
 * @returns {Error}
 */
function BadRequestError (message) {
  return new createError.BadRequest(message)
}

/**
 * NotFoundError constructor
 * @param {string} message - the error message
 * @returns {Error}
 */
function NotFoundError (message) {
  return new createError.NotFound(message)
}

/**
 * ServiceUnavailableError constructor
 * @param {string} message - the error message
 * @returns {Error}
 */
function ServiceUnavailableError (message) {
  return new createError.ServiceUnavailable(message)
}

/**
 * Middleware to handle response for errors
 * @param {Error} err - an Error object (usually)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express `next` callback
 */
function handleErrorResponse (err, req, res, next) {
  const message = err.message || 'Server Error'

  res.status(err.status || 500).format({
    text () {
      res.send(message)
    },

    html () {
      res.send(message)
    },

    json () {
      res.send({ error: message })
    }
  })
}

/**
 * Handler for missing routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express `next` callback
 */
function handleNotFound (req, res, next) {
  next(NotFoundError())
}

module.exports = {
  BadRequestError,
  NotFoundError,
  ServiceUnavailableError,
  handleErrorResponse,
  handleNotFound
}
