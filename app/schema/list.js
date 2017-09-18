/**
 * @overview list schema
 */

const schemaTypes = require('./types')

module.exports = {
  type: 'object',
  properties: {
    list_id: schemaTypes.uuid,
    name: schemaTypes.string,
    archived_at: {
      anyOf: [schemaTypes.date, schemaTypes.null]
    }
  },
  required: [
    'name'
  ]
}
