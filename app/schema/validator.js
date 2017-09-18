/**
 * @overview schema validation class
 */

const Ajv = require('ajv')

class Validator {
  constructor (options, schemas) {
    const ajv = new Ajv(options)
    this.validator = ajv.compile({
      type: 'object',
      properties: schemas
    })
  }

  validate (obj) {
    const valid = this.validator(obj)
    return valid ? null : this.validator.errors
  }
}

module.exports = Validator
