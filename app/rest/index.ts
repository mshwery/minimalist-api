/**
 * @overview route manifest
 */

import express from 'express'
import requireAuthentication from '../middleware/require-authentication'
import * as lists from './lists'
import * as tasks from './tasks'
import * as users from './users'

const router = express.Router()

/** list handlers */
router.all('/lists*', requireAuthentication)
router.get('/lists', lists.getLists)
router.post('/lists', lists.createList)
router.get('/lists/:id', lists.getList)
router.put('/lists/:id', lists.updateList)
router.delete('/lists/:id', lists.deleteList)
router.post('/lists/:id/archive', lists.archiveList)
router.post('/lists/:id/unarchive', lists.unarchiveList)

/** task handlers */
router.all('/tasks*', requireAuthentication)
router.get('/tasks', tasks.getTasks)
router.post('/tasks', tasks.createTask)
router.get('/tasks/:id', tasks.getTask)
router.put('/tasks/:id', tasks.updateTask)
router.delete('/tasks/:id', tasks.deleteTask)
router.post('/tasks/:id/complete', tasks.markComplete)
router.post('/tasks/:id/reopen', tasks.markIncomplete)

/** user handlers */
router.post('/authenticate', users.authenticate)
router.post('/users', users.createUser)
router.delete('/users/:id', requireAuthentication, users.deleteUser)
router.get('/me', requireAuthentication, users.me)

export default router
