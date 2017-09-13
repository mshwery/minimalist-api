/**
 * @overview route manifest
 */

const router = require('express').Router()
const { Validator } = require('express-json-validator-middleware')
const validator = new Validator({ allErrors: true })

/** shim for handling async errors, so you can simply `throw` in async request handlers */
require('express-async-errors')

const lists = require('./lists')
const tasks = require('./tasks')

function requireUuidParam (paramName) {
  return {
    type: 'object',
    properties: {
      [paramName]: {
        type: 'string',
        format: 'uuid'
      }
    },
    required: [paramName]
  }
}

const listIdParam = requireUuidParam('listId')
const taskIdParam = requireUuidParam('taskId')

/** list handlers */
router.get('/lists', lists.getLists)
router.post('/lists', lists.createList)
router.all('/lists/:listId', validator.validate({ params: listIdParam }))
  .get('/lists/:listId', lists.getList)
  .put('/lists/:listId', lists.updateList)
  .patch('/lists/:listId', lists.patchList)
  .delete('/lists/:listId', lists.deleteList)
  .post('/lists/:listId/archive', lists.archiveList)

/** task handlers */
router.get('/tasks', tasks.getTasks)
router.post('/tasks', tasks.createTask)
router.all('/tasks/:taskId', validator.validate({ params: taskIdParam }))
  .get('/tasks/:taskId', tasks.getTask)
  .put('/tasks/:taskId', tasks.updateTask)
  .patch('/tasks/:taskId', tasks.patchTask)
  .delete('/tasks/:taskId', tasks.deleteTask)
  .post('/tasks/:taskId/close', tasks.closeTask)
  .post('/tasks/:taskId/reopen', tasks.reopenTask)

module.exports = router
