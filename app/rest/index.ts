/**
 * @overview route manifest
 */

import express from 'express'
import * as users from './users'
import handleNotFound from '../middleware/not-found'

const router = express.Router()

/** user handlers */
router.post('/authenticate', users.authenticate)
router.post('/users', users.createUser)

router.use(handleNotFound)

export default router
