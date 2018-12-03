/**
 * @overview server entrypoint
 */

import * as express from 'express'
import * as helmet from 'helmet'
import * as config from '../config'
import { handleNotFound, handleErrorResponse } from './middleware/errors'
import applyGraphQLMiddleware from './graphql'
import logger from './lib/logger'
import initConnection from './lib/database'

const app = express()
const port = config.get('PORT') || 3000
app.set('port', port)

/** Provide access to request.ips = [x-forwarded-for headers] */
app.enable('trust proxy')

/** node security modules */
app.use(helmet())

/** basic health endpoint */
app.get('/health', (_req, res) => res.end())

/** graphql server (applies middleware) */
applyGraphQLMiddleware(app)

/** 404 handler */
app.use(handleNotFound)

/** global error catch-all */
app.use(handleErrorResponse)

/** start the server */
initConnection()
  .then(() => {
    app.listen(port, err => {
      if (err) {
        logger.error(err)
        return
      }

      logger.info(`🚀 Server ready at http://localhost:${port}`)
    })
  })
  .catch(err => {
    logger.crit('😱 The server failed to initialize the db connection!', err)
    // do a graceful shutdown,
    // close the database connection etc.
    process.exit(1)
  })

process.on('uncaughtException', err => {
  logger.crit('😱 The server crashed from an uncaught exception!', err)
  // do a graceful shutdown,
  // close the database connection etc.
  process.exit(1)
})

process.on('unhandledRejection', (reason, _promise) => {
  logger.crit('😱 The server crashed from an unhandled rejection!', reason)
  // do a graceful shutdown,
  // close the database connection etc.
  process.exit(1)
})
