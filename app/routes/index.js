/**
 * @overview route manifest
 */

const router = require('express').Router()
const asyncHandler = require('../utils/asyncHandler')
const lists = require('./lists')
const tasks = require('./tasks')

/** basic health endpoint */
router.get('/health', (req, res) => res.end())

/** list handlers */
router.get('/api/lists', asyncHandler(lists.getLists))
router.get('/api/lists/:listId', asyncHandler(lists.getList))
router.post('/api/lists', asyncHandler(lists.createList))
router.put('/api/lists/:listId', asyncHandler(lists.updateList))
router.patch('/api/lists/:listId', asyncHandler(lists.patchList))
router.delete('/api/lists/:listId', asyncHandler(lists.deleteList))

/** task handlers */
router.get('/api/tasks', asyncHandler(tasks.getTasks))
router.get('/api/tasks/:taskId', asyncHandler(tasks.getTask))
router.post('/api/tasks', asyncHandler(tasks.createTask))
router.put('/api/tasks/:taskId', asyncHandler(tasks.updateTask))
router.patch('/api/tasks/:taskId', asyncHandler(tasks.patchTask))
router.delete('/api/tasks/:taskId', asyncHandler(tasks.deleteTask))

module.exports = router
