/**
 * @overview route manifest
 */

import express from 'express'
import * as users from './users'
import handleNotFound from '../middleware/not-found'
import { SESSION_COOKIE } from '../lib/auth'

const router = express.Router()

/** user handlers */
router.post('/authenticate', users.authenticate)
router.post('/users', users.createUser)

router.get('/logout', (req: express.Request, res: express.Response) => {
  req.logout()
  res.clearCookie(SESSION_COOKIE)
  res.redirect('/')
})

router.use(handleNotFound)

export default router
