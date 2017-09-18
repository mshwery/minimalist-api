/**
 * @overview task schema
 */

const schemaTypes = require('./types')

module.exports = {
  type: 'object',
  properties: {
    task_id: schemaTypes.uuid,
    list_id: {
      anyOf: [schemaTypes.uuid, schemaTypes.null]
    },
    content: schemaTypes.string,
    completed: schemaTypes.boolean,
    completed_at: {
      anyOf: [schemaTypes.date, schemaTypes.null]
    }
  },
  required: [
    'content'
  ]
}
