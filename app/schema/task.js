/**
 * @overview task schema
 */

const schemaTypes = require('./types')

module.exports = {
  type: 'object',
  properties: {
    task_id: schemaTypes.uuid,
    list_id: schemaTypes.uuid,
    content: schemaTypes.string,
    completed: schemaTypes.boolean,
    completed_at: schemaTypes.date
  },
  required: [
    'content'
  ]
}
