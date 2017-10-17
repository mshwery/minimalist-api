/**
 * @overview route manifest
 */

const router = require('express').Router()
const withValidation = require('../middleware/validation')

const lists = require('./lists')
const tasks = require('./tasks')
const users = require('./users')

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
  .post('/lists/:id/unarchive', lists.unarchiveList)

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

/** user handlers */
router.post('/users', users.createUser)
router.all('/users/:id', withValidation({ params: id }))
  .get('/users/:id', users.getUser)
  .delete('/users/:id', users.deleteUser)
  // @todo support patch or update methods for a user
  // require password confirmation for these changes?

router.post('/authenticate', users.authenticate)

module.exports = router
