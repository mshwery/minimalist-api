/**
 * @overview user schema
 */

const schemaTypes = require('./types')

module.exports = {
  type: 'object',
  properties: {
    user_id: schemaTypes.uuid,
    email: schemaTypes.email,
    password: schemaTypes.string
  },
  required: [
    'email',
    'password'
  ]
}
