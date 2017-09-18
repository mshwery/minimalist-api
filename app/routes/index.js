/**
 * @overview route manifest
 */

const router = require('express').Router()
const withValidation = require('../middleware/validation')

/** shim for handling async errors, so you can simply `throw` in async request handlers */
require('express-async-errors')

const lists = require('./lists')
const tasks = require('./tasks')

const id = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    }
  },
  required: ['id']
}

/** list handlers */
router.get('/lists', lists.getLists)
router.post('/lists', lists.createList)
router.all('/lists/:id', withValidation({ params: id }))
  .get('/lists/:id', lists.getList)
  .put('/lists/:id', lists.updateList)
  .patch('/lists/:id', lists.patchList)
  .delete('/lists/:id', lists.deleteList)
  .post('/lists/:id/archive', lists.archiveList)

/** task handlers */
router.get('/tasks', tasks.getTasks)
router.post('/tasks', tasks.createTask)
router.all('/tasks/:id', withValidation({ params: id }))
  .get('/tasks/:id', tasks.getTask)
  .put('/tasks/:id', tasks.updateTask)
  .patch('/tasks/:id', tasks.patchTask)
  .delete('/tasks/:id', tasks.deleteTask)
  .post('/tasks/:id/close', tasks.closeTask)
  .post('/tasks/:id/reopen', tasks.reopenTask)

module.exports = router
