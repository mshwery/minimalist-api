/**
 * @overview Express middleware for request validation (body, params, query, etc.) using Ajv/json-schema
 */

const { BadRequest } = require('http-errors')
const Validator = require('../schema/validator')

/**
 * Express middleware that can be used as normal middleware or a route handler higher order function
 * @param {Object} schemas - properties mapping to JSON schemas for validation
 * @param {Function} fn - optional callback function, to use as `withValidation(schemas, (req, res, next) => {})`
 * @example
 *  withValidation({
 *    body: {
 *      type: 'object',
 *      required: ['foo'],
 *      properties: {
 *        foo: {
 *          type: 'string'
 *        }
 *      }
 *    }
 *  },
 *  (req, res, next) => {
 *    res.send('no errors!')
 *  })
 */
module.exports = function withValidation (schemas, fn) {
  const validator = new Validator({ allErrors: true }, schemas)

  return (req, res, next) => {
    const errors = validator.validate(req)

    if (errors) {
      const badRequest = new BadRequest()
      badRequest.validationErrors = errors
      return next(badRequest)
    }

    if (typeof fn === 'function') {
      // support async functions
      return Promise.resolve(fn(req, res, next)).catch(next)
    } else {
      return next()
    }
  }
}
