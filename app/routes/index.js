/**
 * @overview route manifest
 */

const express = require('express')
const lists = require('./lists')
const tasks = require('./tasks')

const router = express.Router()

router.use('/api/lists', lists)
router.use('/api/tasks', tasks)

module.exports = router
