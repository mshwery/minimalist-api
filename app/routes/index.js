/**
 * @overview route manifest
 */

const router = require('express').Router()
const { Validator } = require('express-json-validator-middleware')
const validator = new Validator({ allErrors: true })

const listIdParam = {
  type: 'object',
  properties: {
    listId: {
      type: 'string',
      format: 'uuid'
    }
  },
  required: [
    'listId'
  ]
}

/** shim for handling async errors, so you can simply `throw` in async request handlers */
require('express-async-errors')

const lists = require('./lists')
const tasks = require('./tasks')

/** basic health endpoint */
router.get('/health', (req, res) => res.end())

/** list handlers */
router.get('/api/lists', lists.getLists)
router.get('/api/lists/:listId', validator.validate({ params: listIdParam }), lists.getList)
router.post('/api/lists', lists.createList)
router.put('/api/lists/:listId', lists.updateList)
router.patch('/api/lists/:listId', lists.patchList)
router.delete('/api/lists/:listId', lists.deleteList)

/** task handlers */
router.get('/api/tasks', tasks.getTasks)
router.get('/api/tasks/:taskId', tasks.getTask)
router.post('/api/tasks', tasks.createTask)
router.put('/api/tasks/:taskId', tasks.updateTask)
router.patch('/api/tasks/:taskId', tasks.patchTask)
router.delete('/api/tasks/:taskId', tasks.deleteTask)

module.exports = router
