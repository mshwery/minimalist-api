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

/** basic health endpoint */
router.get('/health', (req, res) => res.end())

/** list handlers */
router.get('/api/lists', lists.getLists)
router.post('/api/lists', lists.createList)
router.all('/api/lists/:listId', validator.validate({ params: listIdParam }))
  .get('/api/lists/:listId', lists.getList)
  .put('/api/lists/:listId', lists.updateList)
  .patch('/api/lists/:listId', lists.patchList)
  .delete('/api/lists/:listId', lists.deleteList)
  .post('/api/lists/:listId/archive', lists.archiveList)

/** task handlers */
router.get('/api/tasks', tasks.getTasks)
router.post('/api/tasks', tasks.createTask)
router.all('/api/tasks/:taskId', validator.validate({ params: taskIdParam }))
  .get('/api/tasks/:taskId', tasks.getTask)
  .put('/api/tasks/:taskId', tasks.updateTask)
  .patch('/api/tasks/:taskId', tasks.patchTask)
  .delete('/api/tasks/:taskId', tasks.deleteTask)

module.exports = router
